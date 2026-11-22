import test from 'node:test';
import assert from 'node:assert';
import worker from '../src/index.js';

test('Mehkesh AI Edge Worker - Worker export verification', (t) => {
  assert.ok(worker, 'Worker module should be exported');
  assert.strictEqual(typeof worker.fetch, 'function', 'Worker should export a fetch handler');
});

test('Mehkesh AI Edge Worker - Static and Landing Route Handler', async (t) => {
  // Mock Request for root '/'
  const req = new Request('https://ai-dev.mehkesh.com/', { method: 'GET' });
  const env = {
    APP_NAME: 'Mehkesh AI',
    GOOGLE_CLIENT_ID: 'test_google_client_id'
  };
  const ctx = { waitUntil: () => {} };

  const res = await worker.fetch(req, env, ctx);
  assert.strictEqual(res.status, 200, 'Root should return 200 OK');
  const contentType = res.headers.get('content-type') || '';
  assert.ok(contentType.includes('text/html'), 'Root should return HTML');
  const html = await res.text();
  assert.ok(html.includes('Mehkesh AI'), 'HTML should contain app name');
  assert.ok(html.includes('id="chatInput"'), 'HTML should render composer');
});

test('Mehkesh AI Edge Worker - Master Password Verification Route Mappings', async (t) => {
  // Test /api/auth/verify
  const reqVerify = new Request('https://ai-dev.mehkesh.com/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'password@1911' })
  });
  const env = { MASTER_PASSWORD: 'password@1911' };
  const ctx = { waitUntil: () => {} };

  const resVerify = await worker.fetch(reqVerify, env, ctx);
  assert.strictEqual(resVerify.status, 200, '/api/auth/verify should succeed with master password');
  const dataVerify = await resVerify.json();
  assert.strictEqual(dataVerify.ok, true);
  assert.strictEqual(dataVerify.user.role, 'admin');

  // Test /api/auth/admin alias
  const reqAdmin = new Request('https://ai-dev.mehkesh.com/api/auth/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'password@1911' })
  });
  const resAdmin = await worker.fetch(reqAdmin, env, ctx);
  assert.strictEqual(resAdmin.status, 200, '/api/auth/admin should also succeed with master password');
  const dataAdmin = await resAdmin.json();
  assert.strictEqual(dataAdmin.ok, true);
  assert.strictEqual(dataAdmin.user.role, 'admin');
});

test('Mehkesh AI Edge Worker - Guest Mode Route Allowance & Headers', async (t) => {
  const reqMe = new Request('https://ai-dev.mehkesh.com/api/auth/me', {
    method: 'GET',
    headers: { 'CF-Connecting-IP': '1.2.3.4' }
  });
  const env = {};
  const ctx = { waitUntil: () => {} };

  const resMe = await worker.fetch(reqMe, env, ctx);
  assert.strictEqual(resMe.status, 200, '/api/auth/me should return 200 for guest');
  const dataMe = await resMe.json();
  assert.strictEqual(dataMe.authenticated, false);
  assert.strictEqual(Boolean(dataMe.guest), true);
  assert.strictEqual(dataMe.guest.allowed, true);
  assert.strictEqual(dataMe.guest_limit, 3);
  assert.strictEqual(typeof dataMe.guest_remaining, 'number');
});

test('Mehkesh AI Edge Worker - Logout Header & Cookie Invalidation', async (t) => {
  const reqLogout = new Request('https://ai-dev.mehkesh.com/api/auth/logout', { method: 'POST' });
  const env = {};
  const ctx = { waitUntil: () => {} };

  const res = await worker.fetch(reqLogout, env, ctx);
  assert.strictEqual(res.status, 200, 'Logout should succeed');
  const setCookie = res.headers.get('set-cookie') || '';
  assert.ok(setCookie.includes('auth_token='), 'Should clear auth_token');
  assert.ok(setCookie.includes('auth_password='), 'Should clear auth_password');
  assert.ok(setCookie.includes('Max-Age=0'), 'Should expire cookies immediately');
});
