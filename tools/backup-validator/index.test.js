const assert = require('node:assert/strict');
const { test } = require('node:test');
const { validateBackup } = require('./index');

test('valid backup reports record count', () => {
  const result = validateBackup({ schemaVersion: 1, createdAt: '2026-01-01T00:00:00Z', records: [{ id: '1' }] });
  assert.equal(result.ok, true);
  assert.equal(result.recordCount, 1);
});

test('duplicate ids fail integrity validation', () => {
  const result = validateBackup({ schemaVersion: 1, createdAt: '2026-01-01T00:00:00Z', records: [{ id: '1' }, { id: '1' }] });
  assert.equal(result.ok, false);
});
