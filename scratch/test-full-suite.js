const http = require('http');

async function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING JYOTISHVEDA INTEGRATION VERIFICATION ===\n');
  let testCount = 0;
  let passCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Location Autocomplete API
  console.log('--- 1. Testing Server-Side Geocoding API ---');
  const locRes = await request({
    hostname: 'localhost',
    port: 1337,
    path: '/api/location/search?q=Varanasi',
    method: 'GET',
  });
  assert(locRes.status === 200, 'Geocoding endpoint returned 200 OK');
  assert(Array.isArray(locRes.body?.data) && locRes.body.data.length > 0, 'Found geocoded location for Varanasi');
  const vns = locRes.body?.data?.[0];
  assert(Math.abs(vns?.latitude - 25.3176) < 0.5, `Varanasi latitude accurate: ${vns?.latitude}`);
  assert(Math.abs(vns?.longitude - 82.9739) < 0.5, `Varanasi longitude accurate: ${vns?.longitude}`);
  assert(vns?.timezoneOffset === 5.5, `Indian Standard Time timezone is UTC +5.5`);

  // 2. Real Vedic Kundli Calculation Engine
  console.log('\n--- 2. Testing Real Vedic Kundli & Navamsha Engine ---');
  const kundliRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/kundli/generate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      fullName: 'Vikramaditya Sharma',
      dateOfBirth: '1992-10-24',
      timeOfBirth: '07:45',
      placeOfBirth: 'Varanasi, Uttar Pradesh, India',
      latitude: 25.3176,
      longitude: 82.9739,
      timezoneOffset: 5.5,
      ayanamsa: 'Lahiri',
    }
  );

  assert(kundliRes.status === 200, 'Kundli generation returned 200 OK');
  const chartData = kundliRes.body?.data?.chartData;
  assert(chartData && chartData.ascendant, 'Ascendant (Lagna) calculated');
  assert(chartData.moonSign && chartData.moonSign.signName, `Moon sign calculated: ${chartData.moonSign?.signName}`);
  assert(chartData.moonSign.nakshatra, `Janma Nakshatra calculated: ${chartData.moonSign?.nakshatra}`);
  assert(Array.isArray(chartData.planets) && chartData.planets.length >= 9, 'All 9 Grahas calculated');

  // Verify Retrograde status & Dignity
  const jupiter = chartData.planets.find((p) => p.name === 'Jupiter' || p.sanskrit === 'Guru');
  assert(jupiter && typeof jupiter.isRetrograde === 'boolean', `Planetary retrograde motion detected (Jupiter isRetrograde: ${jupiter?.isRetrograde})`);
  assert(jupiter && jupiter.dignity, `Planetary dignity calculated for Jupiter: ${jupiter?.dignity}`);

  // Verify Navamsha D-9 Houses
  assert(Array.isArray(chartData.navamsaHouses) && chartData.navamsaHouses.length === 12, 'D-9 Navamsha 12 Bhavas calculated');
  assert(Array.isArray(chartData.houses) && chartData.houses.length === 12, 'D-1 Lagna 12 Bhavas calculated');
  assert(Array.isArray(chartData.dasha?.timeline) && chartData.dasha.timeline.length > 0, `Vimshottari Mahadasha timeline calculated (Balance: ${chartData.dasha?.balanceDashaPlanet})`);

  // 3. User Authentication for Chat & Consultation
  console.log('\n--- 3. Testing User Authentication ---');
  const testEmail = `astrouser_${Date.now()}@jyotishveda.com`;
  const registerRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/auth/local/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: `AstroSeeker_${Date.now().toString().slice(-4)}`,
      email: testEmail,
      password: 'SecureVedicPassword123!',
    }
  );

  assert(registerRes.status === 200 && registerRes.body?.jwt, 'User registered successfully and received JWT');
  const token = registerRes.body?.jwt;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 4. Free First Chat Eligibility Check (Backend Enforced)
  console.log('\n--- 4. Testing Free First Chat Eligibility ---');
  const eligRes = await request({
    hostname: 'localhost',
    port: 1337,
    path: '/api/chat/eligibility',
    method: 'GET',
    headers: authHeaders,
  });

  assert(eligRes.status === 200, 'Chat eligibility endpoint returned 200 OK');
  assert(eligRes.body?.data?.freeSessionUsed === false, 'New user has freeSessionUsed = false');
  assert(eligRes.body?.data?.eligibleForFreeIntro === true, 'New user is eligible for free introductory consultation');

  // 5. Start Free Astrologer Chat Session
  console.log('\n--- 5. Starting Free Introductory Chat Session ---');
  const startFreeRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/chat/start-free-session',
      method: 'POST',
      headers: authHeaders,
    },
    { astrologerId: 1 }
  );

  assert(startFreeRes.status === 200, 'Free chat session initiated successfully');
  const session = startFreeRes.body?.data;
  assert(session && session.sessionType === 'free_intro', 'Session type is free_intro');
  assert(session.durationMinutes === 5, 'Session duration is 5 minutes');
  assert(session.maxMessages === 10, 'Session maxMessages limit is 10');
  assert(session.status === 'active', 'Session status is active');

  // 6. Test Free Chat Eligibility is now permanently False (Cannot be bypassed)
  console.log('\n--- 6. Verifying Free Chat Eligibility Backend Locking ---');
  const recheckElig = await request({
    hostname: 'localhost',
    port: 1337,
    path: '/api/chat/eligibility',
    method: 'GET',
    headers: authHeaders,
  });
  assert(recheckElig.body?.data?.freeSessionUsed === true, 'freeSessionUsed is now TRUE in database');
  assert(recheckElig.body?.data?.eligibleForFreeIntro === false, 'eligibleForFreeIntro is now FALSE');

  // Attempting second free session must be rejected with 400
  const secondFreeAttempt = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/chat/start-free-session',
      method: 'POST',
      headers: authHeaders,
    },
    { astrologerId: 1 }
  );
  assert(secondFreeAttempt.status === 400, 'Second free chat attempt rejected by backend (400 Bad Request)');

  // 7. Live Astrologer Two-Way Messaging
  console.log('\n--- 7. Testing Real-Time Astrologer Message Exchange ---');
  const sendMsgRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: `/api/chat/sessions/${session.sessionNumber}/messages`,
      method: 'POST',
      headers: authHeaders,
    },
    { message: 'Pranam Acharya ji. How will my Saturn Mahadasha affect my career path?' }
  );

  assert(sendMsgRes.status === 200, 'Message sent successfully (200 OK)');
  const msgData = sendMsgRes.body?.data;
  assert(msgData && msgData.userMessage, 'User question stored in database');
  assert(msgData && msgData.astrologerResponse, 'Acharya scholarly response generated');
  assert(msgData.astrologerResponse.senderType === 'astrologer', 'Response sender is astrologer');
  console.log(`[SAMPLE ASTROLOGER RESPONSE]: "${msgData.astrologerResponse?.message?.slice(0, 140)}..."`);

  // Verify message history retrieval
  const historyRes = await request({
    hostname: 'localhost',
    port: 1337,
    path: `/api/chat/sessions/${session.sessionNumber}/messages`,
    method: 'GET',
    headers: authHeaders,
  });
  assert(historyRes.status === 200 && historyRes.body?.data?.length >= 2, 'Chat history persisted and reloaded successfully');

  // 8. Razorpay Payment Order & Paid Astrologer Consultation Flow
  console.log('\n--- 8. Testing Razorpay Order & Paid Consultation Unlock ---');
  // First, create a real consultation booking
  const createBookingRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/bookings',
      method: 'POST',
      headers: authHeaders,
    },
    {
      data: {
        astrologerId: 1,
        date: `2026-11-${Math.floor(10 + Math.random() * 18)}`,
        timeSlot: `${Math.floor(1 + Math.random() * 12)}:00 PM`,
        topic: 'Career Transitions & Navamsha D-9',
        clientNotes: 'Paid Live Consultation Test',
      },
    }
  );

  assert(createBookingRes.status === 200, 'Consultation booking created (200 OK)');
  const bookingId = createBookingRes.body?.data?.id || createBookingRes.body?.id;
  assert(Boolean(bookingId), `Booking created with ID: ${bookingId}`);

  const orderRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/payments/create-order',
      method: 'POST',
      headers: authHeaders,
    },
    {
      amount: 750,
      serviceType: 'consultation',
      referenceId: String(bookingId),
    }
  );

  assert(orderRes.status === 200, 'Razorpay order created on Strapi (200 OK)');
  const order = orderRes.body?.data;
  assert(order && order.orderId && order.orderId.startsWith('order_'), `Valid Razorpay orderId: ${order?.orderId}`);
  assert(order.amount === 750, 'Order amount matches requested 750 INR');

  // Verify HMAC-SHA256 test payment signature
  const verifyRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/payments/verify',
      method: 'POST',
      headers: authHeaders,
    },
    {
      orderId: order.orderId,
      paymentId: `pay_test_${Date.now()}`,
      signature: 'test_signature_valid',
      serviceType: 'consultation',
      referenceId: String(bookingId),
    }
  );

  assert(verifyRes.status === 200 && verifyRes.body?.success === true, 'Razorpay signature verified on backend');

  // Unlock paid chat session
  const paidSessionRes = await request(
    {
      hostname: 'localhost',
      port: 1337,
      path: '/api/chat/start-paid-session',
      method: 'POST',
      headers: authHeaders,
    },
    { bookingId: Number(bookingId) }
  );

  assert(paidSessionRes.status === 200, 'Paid consultation chat session unlocked successfully');
  const paidSession = paidSessionRes.body?.data;
  assert(paidSession && paidSession.sessionType === 'paid_consultation', 'Session type is paid_consultation');
  assert(paidSession.durationMinutes >= 15, `Paid session duration granted: ${paidSession?.durationMinutes} mins`);

  console.log(`\n=== VERIFICATION COMPLETE: ${passCount}/${testCount} TESTS PASSED ===`);
  if (passCount === testCount) {
    console.log('ALL VEDIC ASTROLOGY, GEOLOCATION, CHAT & PAYMENT CRITERIA SATISFIED!\n');
  }
}

runTests().catch(console.error);
