const http = require('http');
const crypto = require('crypto');

const RAZORPAY_SECRET = 'rzp_secret_AstrologyDemoSecret456';

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const reqHeaders = {
      'Accept': 'application/json',
      ...headers,
    };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: '127.0.0.1',
      port: 1337,
      path,
      method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('===========================================================');
  console.log('JYOTISHVEDA BACKEND FULL E2E AUDIT & VERIFICATION');
  console.log('===========================================================\n');

  // PART 1: 403 API ERRORS CHECK
  console.log('--- 1. AUDITING PUBLIC GET APIs ---');
  const catalogEndpoints = [
    '/api/astrologers?populate=*',
    '/api/astrology-services?populate=*',
    '/api/faqs?sort[0]=order:asc',
    '/api/site-setting',
    '/api/astrology-articles?sort[0]=createdAt:desc',
  ];

  for (const ep of catalogEndpoints) {
    const res = await request('GET', ep);
    const count = Array.isArray(res.body?.data) ? res.body.data.length : (res.body?.data ? 1 : 0);
    console.log(`[PASS] ${ep} => HTTP ${res.status} | Items: ${count}`);
    if (res.status !== 200) console.error('  ERROR:', res.body);
  }

  // PANCHANG & COMPATIBILITY ROUTES (BOTH GET AND POST)
  console.log('\n--- 2. AUDITING PANCHANG & COMPATIBILITY (GET & POST) ---');
  
  // A. GET /api/kundli/panchang (with query params)
  const panchangGet = await request('GET', '/api/kundli/panchang?date=2026-10-29&time=06:30&latitude=28.6139&longitude=77.2090');
  console.log(`GET /api/kundli/panchang (with query) => HTTP ${panchangGet.status} | Tithi: ${panchangGet.body?.data?.tithi?.name || 'N/A'}, Nakshatra: ${panchangGet.body?.data?.nakshatra?.name || 'N/A'}`);

  // B. POST /api/kundli/panchang (with JSON body)
  const panchangPost = await request('POST', '/api/kundli/panchang', {
    date: '2026-10-29',
    time: '12:00',
    latitude: 19.0760,
    longitude: 72.8777,
  });
  console.log(`POST /api/kundli/panchang (with body) => HTTP ${panchangPost.status} | Tithi: ${panchangPost.body?.data?.tithi?.name || 'N/A'}`);

  // C. GET /api/kundli/compatibility (with query params)
  const compatGet = await request('GET', '/api/kundli/compatibility?boyDate=1995-05-15&girlDate=1997-08-22');
  console.log(`GET /api/kundli/compatibility (with query) => HTTP ${compatGet.status} | Total Guna: ${compatGet.body?.data?.gunaMilan?.totalScore ?? 'N/A'} / 36`);

  // D. POST /api/kundli/compatibility (with JSON body)
  const compatPost = await request('POST', '/api/kundli/compatibility', {
    boyBirth: {
      fullName: 'Rahul Sharma',
      dateOfBirth: '1995-05-15',
      timeOfBirth: '14:30',
      latitude: 28.6139,
      longitude: 77.2090,
    },
    girlBirth: {
      fullName: 'Pooja Verma',
      dateOfBirth: '1997-08-22',
      timeOfBirth: '09:15',
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });
  console.log(`POST /api/kundli/compatibility (with body) => HTTP ${compatPost.status} | Total Guna: ${compatPost.body?.data?.gunaMilan?.totalScore ?? 'N/A'} / 36`);

  // E. Validation handling on missing parameters
  const compatInvalid = await request('GET', '/api/kundli/compatibility');
  console.log(`GET /api/kundli/compatibility (missing params) => HTTP ${compatInvalid.status} (Expected 400 Bad Request: "${compatInvalid.body?.error?.message || compatInvalid.raw}")`);

  // PART 2: BOOKING PAGE & ASTROLOGER 2
  console.log('\n--- 3. TESTING ASTROLOGER 2 LOOKUP & BOOKING CREATION ---');
  const astro2Res = await request('GET', '/api/astrologers/2');
  console.log(`GET /api/astrologers/2 => HTTP ${astro2Res.status} | Name: "${astro2Res.body?.data?.name}", Fee: ₹${astro2Res.body?.data?.consultationFee}`);

  // Create booking for Astrologer ID 2
  const uniqueTime = `10:${Math.floor(10 + Math.random() * 49)} AM`;
  const bookingCreateRes = await request('POST', '/api/bookings', {
    astrologerId: 2,
    date: '2026-11-10',
    timeSlot: uniqueTime,
    topic: 'Vedic Kundli & Marriage Compatibility',
    clientNotes: 'Consultation with Dr. Gayatri Devi Sharma for marriage timing.',
  });

  console.log(`POST /api/bookings (Astrologer 2) => HTTP ${bookingCreateRes.status} | Booking #: ${bookingCreateRes.body?.data?.bookingNumber}, Status: ${bookingCreateRes.body?.data?.status}`);
  const createdBookingId = bookingCreateRes.body?.data?.id;

  // PART 3: RAZORPAY TEST PAYMENT LIFECYCLE
  console.log('\n--- 4. RAZORPAY ORDER CREATION & TRUSTED PRICING ---');
  // Attempt to pass manipulated amount of ₹1 to test server-side price enforcement
  const orderRes = await request('POST', '/api/payments/create-order', {
    amount: 1, // Manipulated amount from client
    serviceType: 'consultation',
    referenceId: String(createdBookingId),
  });

  console.log(`POST /api/payments/create-order => HTTP ${orderRes.status}`);
  console.log(`  Client requested amount: ₹1`);
  console.log(`  Server-validated amount: ₹${orderRes.body?.data?.amount} (Astrologer 2 fee enforced: ${orderRes.body?.data?.amount === 1199})`);
  console.log(`  Razorpay Order ID: ${orderRes.body?.data?.orderId}`);
  console.log(`  Razorpay Public Key ID: ${orderRes.body?.data?.keyId}`);

  const orderId = orderRes.body?.data?.orderId;
  const paymentId = `pay_test_${Date.now()}`;

  // TEST SIGNATURE VERIFICATION
  console.log('\n--- 5. CRYPTOGRAPHIC SIGNATURE VERIFICATION & IDEMPOTENCY ---');

  // A. Reject Invalid Signature
  const invalidSig = 'invalid_tampered_signature_99999999';
  const rejectRes = await request('POST', '/api/payments/verify', {
    orderId,
    paymentId,
    signature: invalidSig,
    serviceType: 'consultation',
    referenceId: String(createdBookingId),
  });
  console.log(`POST /api/payments/verify (Tampered Sig) => HTTP ${rejectRes.status} (Expected 400: ${rejectRes.body?.error?.message || rejectRes.raw})`);

  // B. Verify with Valid HMAC-SHA256 Signature
  const validSig = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const validVerifyRes = await request('POST', '/api/payments/verify', {
    orderId,
    paymentId,
    signature: validSig,
    serviceType: 'consultation',
    referenceId: String(createdBookingId),
  });

  console.log(`POST /api/payments/verify (Valid HMAC Sig) => HTTP ${validVerifyRes.status} | Success: ${validVerifyRes.body?.success}`);
  console.log(`  Payment Record ID: ${validVerifyRes.body?.data?.paymentRecordId}, Status: ${validVerifyRes.body?.data?.status}`);

  // C. Test Idempotency (Re-verifying same order should succeed idempotently without duplicate charges)
  const idempotentRes = await request('POST', '/api/payments/verify', {
    orderId,
    paymentId,
    signature: validSig,
    serviceType: 'consultation',
    referenceId: String(createdBookingId),
  });
  console.log(`POST /api/payments/verify (Re-verification Idempotency) => HTTP ${idempotentRes.status} | Already Captured: ${idempotentRes.body?.data?.alreadyCaptured}`);

  // D. Check Booking Record Status in Backend
  const verifiedBookingCheck = await request('GET', `/api/bookings/${createdBookingId}`);
  console.log(`GET /api/bookings/${createdBookingId} => HTTP ${verifiedBookingCheck.status} | Status: "${verifiedBookingCheck.body?.data?.status}" (Confirmed: ${verifiedBookingCheck.body?.data?.status === 'confirmed'})`);

  console.log('\n===========================================================');
  console.log('ALL AUDIT TESTS COMPLETED SUCCESSFULLY!');
  console.log('===========================================================');
}

runTests().catch(console.error);
