const assert = require('node:assert/strict');
const { test } = require('node:test');
const { summarize } = require('./index');

test('deletions and replacements are high risk', () => {
  const result = summarize({ resource_changes: [
    { address: 'a', change: { actions: ['delete'] } },
    { address: 'b', change: { actions: ['delete', 'create'] } },
  ] });
  assert.equal(result.delete, 1);
  assert.equal(result.replace, 1);
  assert.equal(result.risk, 'HIGH');
});
