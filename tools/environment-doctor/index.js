#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

const tools = [
  { name: 'git', required: true, args: ['--version'] },
  { name: 'docker', required: true, args: ['--version'] },
  { name: 'node', required: true, args: ['--version'], minimumMajor: 20 },
  { name: 'kubectl', required: false, args: ['version', '--client=true'] },
  { name: 'kind', required: false, args: ['version'] },
  { name: 'helm', required: false, args: ['version', '--short'] },
  { name: 'tofu', required: false, args: ['version'] },
  { name: 'trivy', required: false, args: ['--version'] },
  { name: 'cosign', required: false, args: ['version'] },
  { name: 'syft', required: false, args: ['version'] },
];

function firstLine(value) {
  return String(value || '').trim().split(/\r?\n/)[0];
}

function majorVersion(value) {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : null;
}

function checkTool(tool, runner = spawnSync) {
  const result = runner(tool.name, tool.args, { encoding: 'utf8', windowsHide: true, timeout: 5000 });
  const found = !result.error && result.status === 0;
  const response = {
    name: tool.name,
    required: tool.required,
    found,
    version: found ? firstLine(result.stdout || result.stderr) : null,
  };
  if (found && tool.minimumMajor) response.compatible = majorVersion(response.version) >= tool.minimumMajor;
  if (tool.minimumMajor) response.minimumMajor = tool.minimumMajor;
  return response;
}

function main() {
  const json = process.argv.includes('--json');
  const strict = process.argv.includes('--strict');
  const results = tools.map((tool) => checkTool(tool));
  if (json) {
    console.log(JSON.stringify({ results }, null, 2));
  } else {
    console.log('DevOps environment doctor\n');
    for (const result of results) {
      const status = !result.found ? (result.required ? 'MISSING' : 'OPTION ') : result.compatible === false ? 'OLD    ' : 'OK     ';
      console.log(`${status} ${result.name.padEnd(10)} ${result.version ?? 'not installed'}`);
    }
    console.log('\nOPTION means the tool is only needed by later labs.');
  }
  const missingRequired = results.some((result) => result.required && (!result.found || result.compatible === false));
  if (missingRequired || (strict && results.some((result) => !result.found))) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { checkTool, firstLine, majorVersion };
