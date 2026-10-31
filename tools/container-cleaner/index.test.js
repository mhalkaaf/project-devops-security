const assert = require('node:assert/strict');
const { test } = require('node:test');
const { candidates, olderThan } = require('./index');

test('olderThan compares image age', () => {
  const now = Date.parse('2026-10-30T00:00:00Z');
  assert.equal(olderThan('2026-10-01T00:00:00Z', 7, now), true);
  assert.equal(olderThan('2026-10-29T00:00:00Z', 7, now), false);
});

test('candidates ignore rows without image id', () => {
  const now = Date.parse('2026-10-30T00:00:00Z');
  assert.equal(candidates([{ ID: '', CreatedAt: '2020-01-01T00:00:00Z' }], 7, now).length, 0);
});
