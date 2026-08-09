const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/server');

let server;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
});

after(() => {
  server.close();
});

function requestLocal(pathname) {
  return new Promise((resolve, reject) => {
    http
      .get({ hostname: '127.0.0.1', port: server.address().port, path: pathname }, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      })
      .on('error', reject);
  });
}

test('serves the homepage with security headers', async () => {
  const res = await requestLocal('/');
  assert.equal(res.status, 200);
  assert.equal(res.headers['x-frame-options'], 'SAMEORIGIN');
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.match(res.headers['content-security-policy'], /default-src 'self'/);
  assert.match(res.body, /<title>Francis J\. Garc[íi]a/);
});

test('serves static assets with long-lived cache headers', async () => {
  const res = await requestLocal('/js/main.js');
  assert.equal(res.status, 200);
  assert.equal(res.headers['cache-control'], 'public, immutable, max-age=31536000');
});

test('falls back to index.html for unknown routes (SPA)', async () => {
  const res = await requestLocal('/this-route-does-not-exist');
  assert.equal(res.status, 200);
  assert.equal(res.headers['cache-control'], 'no-cache, must-revalidate');
  assert.match(res.body, /<title>Francis J\. Garc[íi]a/);
});

test('proxies /api/uptime/* and returns the upstream JSON', async (t) => {
  t.mock.method(global, 'fetch', async (url) => {
    assert.equal(url, 'https://status.francisjgarcia.es/api/status-page/multimedia');
    return { json: async () => ({ ok: true }) };
  });

  const res = await requestLocal('/api/uptime/status-page/multimedia');
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
});

test('returns 502 when the upstream status page is unreachable', async (t) => {
  t.mock.method(global, 'fetch', async () => {
    throw new Error('network down');
  });

  const res = await requestLocal('/api/uptime/status-page/multimedia');
  assert.equal(res.status, 502);
  assert.deepEqual(JSON.parse(res.body), { error: 'Failed to fetch status' });
});
