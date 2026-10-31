const assert = require('node:assert/strict');
const http = require('node:http');
const { test } = require('node:test');
const { handler, numberFromEnv } = require('../src/app');

function request(baseUrl, path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const req = http.request(url, { method: options.method ?? 'GET', headers: options.headers ?? {} }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve({
        status: response.statusCode,
        headers: response.headers,
        text: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function withServer(callback) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
    return await callback(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('root returns application metadata and request id', async () => {
  await withServer(async (baseUrl) => {
    const response = await request(baseUrl, '/', { headers: { 'x-request-id': 'test-id' } });
    const body = JSON.parse(response.text);
    assert.equal(response.status, 200);
    assert.equal(body.name, 'demo-api');
    assert.equal(body.requestId, 'test-id');
  });
});

test('health endpoints expose liveness and readiness', async () => {
  await withServer(async (baseUrl) => {
    const live = await request(baseUrl, '/health/live');
    const ready = await request(baseUrl, '/health/ready');
    assert.equal(live.status, 200);
    assert.equal(ready.status, 200);
  });
});

test('unknown routes return a structured 404', async () => {
  await withServer(async (baseUrl) => {
    const response = await request(baseUrl, '/missing');
    const body = JSON.parse(response.text);
    assert.equal(response.status, 404);
    assert.equal(body.error, 'not_found');
  });
});

test('metrics are Prometheus compatible text', async () => {
  await withServer(async (baseUrl) => {
    await request(baseUrl, '/api/work');
    const response = await request(baseUrl, '/metrics');
    const body = response.text;
    assert.equal(response.status, 200);
    assert.match(body, /demo_api_requests_total/);
    assert.match(body, /demo_api_work_duration_milliseconds_count/);
  });
});

test('numeric configuration is clamped and validated', () => {
  process.env.TEST_NUMBER = '100';
  assert.equal(numberFromEnv('TEST_NUMBER', 1, 0, 10), 10);
  process.env.TEST_NUMBER = 'invalid';
  assert.equal(numberFromEnv('TEST_NUMBER', 1, 0, 10), 1);
  delete process.env.TEST_NUMBER;
});
