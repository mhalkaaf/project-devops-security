#!/usr/bin/env node
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

function summarize(plan) {
  const summary = { create: 0, update: 0, delete: 0, replace: 0, noOp: 0, read: 0, risk: 'LOW', resources: [] };
  for (const change of plan.resource_changes ?? []) {
    const actions = change.change?.actions ?? [];
    let type = 'other';
    if (actions.includes('create') && actions.includes('delete')) type = 'replace';
    else if (actions.includes('create')) type = 'create';
    else if (actions.includes('update')) type = 'update';
    else if (actions.includes('delete')) type = 'delete';
    else if (actions.includes('read')) type = 'read';
    else if (actions.includes('no-op')) type = 'noOp';
    if (Object.hasOwn(summary, type)) summary[type] += 1;
    if (!['noOp', 'read'].includes(type)) summary.resources.push({ address: change.address, action: type });
  }
  if (summary.delete > 0 || summary.replace > 0) summary.risk = 'HIGH';
  else if (summary.update > 0 || summary.create > 0) summary.risk = 'MEDIUM';
  return summary;
}

function loadPlan(args) {
  const inputIndex = args.indexOf('--input');
  if (inputIndex >= 0) return JSON.parse(fs.readFileSync(args[inputIndex + 1], 'utf8'));
  const planIndex = args.indexOf('--plan');
  if (planIndex < 0) throw new Error('Use --input plan.json or --plan tfplan');
  const result = spawnSync('tofu', ['show', '-json', args[planIndex + 1]], { encoding: 'utf8', windowsHide: true });
  if (result.error || result.status !== 0) throw new Error(result.stderr || result.error?.message || 'tofu show failed');
  return JSON.parse(result.stdout);
}

function main() {
  try {
    const args = process.argv.slice(2);
    const result = summarize(loadPlan(args));
    if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`IaC drift risk: ${result.risk}`);
      console.log(`create=${result.create} update=${result.update} delete=${result.delete} replace=${result.replace}`);
      result.resources.forEach((item) => console.log(`${item.action.padEnd(8)} ${item.address}`));
    }
    if (result.risk === 'HIGH') process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) main();
module.exports = { summarize };
