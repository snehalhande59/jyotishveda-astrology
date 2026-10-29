const http = require('http');

function req(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 1337,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };
    const r = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body.substring(0, 200) });
        }
      });
    });
    r.on('error', reject);
    r.end();
  });
}

function post(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: '127.0.0.1',
      port: 1337,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const r = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    r.on('error', reject);
    r.write(postData);
    r.end();
  });
}

async function run() {
  console.log('=== 1. TESTING PUBLIC (GUEST) ACCESS ===');
  const endpoints = [
    '/api/astrologers?populate=*',
    '/api/faqs?sort[0]=order:asc',
    '/api/site-setting',
    '/api/astrology-articles?sort[0]=createdAt:desc',
    '/api/astrology-services?populate=*'
  ];

  for (const ep of endpoints) {
    const res = await req(ep);
    const count = Array.isArray(res.body?.data) ? res.body.data.length : (res.body?.data ? 1 : 0);
    console.log(`GUEST: ${ep} => Status: ${res.status} | Data count: ${count}`);
    if (res.status !== 200) console.log('  Error:', res.body?.error || res.raw);
  }

  console.log('\n=== 2. OBTAINING AUTHENTICATED USER TOKEN ===');
  let userToken = null;
  const loginRes = await post('/api/auth/local', {
    identifier: 'testuser@jyotishveda.com',
    password: 'UserJyotish@2026'
  });

  if (loginRes.status === 200 && loginRes.body?.jwt) {
    userToken = loginRes.body.jwt;
    console.log('Logged in as existing test user. Token length:', userToken.length);
  } else {
    const uniqueSuffix = Date.now();
    const regRes = await post('/api/auth/local/register', {
      username: 'testuser_' + uniqueSuffix,
      email: 'testuser_' + uniqueSuffix + '@jyotishveda.com',
      password: 'UserJyotish@2026'
    });
    if (regRes.status === 200 && regRes.body?.jwt) {
      userToken = regRes.body.jwt;
      console.log('Registered new test user. Token length:', userToken.length);
    } else {
      console.log('Register failed:', regRes.status, regRes.body);
    }
  }

  if (userToken) {
    console.log('\n=== 3. TESTING AUTHENTICATED USER ACCESS (THE PREVIOUS 403 BUG) ===');
    for (const ep of endpoints) {
      const res = await req(ep, { 'Authorization': `Bearer ${userToken}` });
      const count = Array.isArray(res.body?.data) ? res.body.data.length : (res.body?.data ? 1 : 0);
      console.log(`AUTH USER: ${ep} => Status: ${res.status} | Data count: ${count}`);
      if (res.status !== 200) console.log('  Error:', res.body?.error || res.raw);
    }
  }

  console.log('\n=== 4. TESTING SECURITY & SENSITIVE ENDPOINTS (MUST BE PROTECTED) ===');
  const sensitiveEndpoints = [
    '/api/payment-records',
    '/api/users',
  ];
  for (const ep of sensitiveEndpoints) {
    const resGuest = await req(ep);
    console.log(`SECURITY GUEST: ${ep} => Status: ${resGuest.status} (Expected 401 or 403)`);
    if (userToken) {
      const resAuth = await req(ep, { 'Authorization': `Bearer ${userToken}` });
      console.log(`SECURITY AUTH: ${ep} => Status: ${resAuth.status} (Expected 401 or 403)`);
    }
  }

  console.log('\n=== 5. TESTING ADMIN LOGIN & FAVICON ===');
  const adminLogin = await post('/admin/login', {
    email: 'snehalhande59@gmail.com',
    password: 'AdminJyotish@2026'
  });
  console.log(`ADMIN LOGIN => Status: ${adminLogin.status} | Token exists: ${!!adminLogin.body?.data?.token}`);

  const faviconRes = await req('/favicon.ico');
  console.log(`FAVICON => Status: ${faviconRes.status}`);
}

run().catch(console.error);
