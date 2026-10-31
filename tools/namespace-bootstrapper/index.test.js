const assert = require('node:assert/strict');
const { test } = require('node:test');
const { render, safeName } = require('./index');

test('render creates namespace guardrails', () => {
  const yaml = render('team-demo');
  assert.match(yaml, /name: team-demo/);
  assert.match(yaml, /kind: ResourceQuota/);
  assert.match(yaml, /pod-security.kubernetes.io\/enforce: restricted/);
});

test('invalid namespace is rejected', () => {
  assert.throws(() => safeName('Invalid_Name'));
});
