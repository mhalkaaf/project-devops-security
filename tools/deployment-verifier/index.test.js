const assert = require('node:assert/strict');
const { test } = require('node:test');
const { parseArgs, verify } = require('./index');

test('parseArgs reads verifier options', () => {
  const config = parseArgs(['--url', 'http://example.test', '--retries', '2', '--json']);
  assert.equal(config.url, 'http://example.test');
  assert.equal(config.retries, 2);
  assert.equal(config.json, true);
});

test('verify passes when every endpoint is healthy', async () => {
  const fetcher = async () => ({ ok: true, status: 200 });
  const result = await verify({ url: 'http://example.test', retries: 1, interval: 0, timeout: 10 }, fetcher);
  assert.equal(result.ok, true);
  assert.equal(result.checks.length, 3);
});
