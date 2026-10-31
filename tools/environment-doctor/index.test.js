const assert = require('node:assert/strict');
const { test } = require('node:test');
const { checkTool, firstLine, majorVersion } = require('./index');

test('firstLine normalizes multiline output', () => {
  assert.equal(firstLine('v1.2.3\nmore'), 'v1.2.3');
});

test('majorVersion supports common version formats', () => {
  assert.equal(majorVersion('v26.13.0'), 26);
  assert.equal(majorVersion('Docker version 27.4.0'), 27);
});

test('checkTool reports an outdated runtime', () => {
  const runner = () => ({ status: 0, stdout: 'v24.22.2\n', stderr: '' });
  const result = checkTool({ name: 'node', required: true, args: [], minimumMajor: 26 }, runner);
  assert.equal(result.found, true);
  assert.equal(result.compatible, false);
});

test('checkTool reports successful command', () => {
  const runner = () => ({ status: 0, stdout: 'tool 1.0\n', stderr: '' });
  assert.deepEqual(checkTool({ name: 'tool', required: true, args: [] }, runner), {
    name: 'tool', required: true, found: true, version: 'tool 1.0',
  });
});
