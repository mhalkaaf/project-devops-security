#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');

function validateBackup(document) {
  const errors = [];
  if (document.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!document.createdAt || Number.isNaN(Date.parse(document.createdAt))) errors.push('createdAt must be an ISO date');
  if (!Array.isArray(document.records)) errors.push('records must be an array');
  else {
    const ids = new Set();
    document.records.forEach((record, index) => {
      if (!record || typeof record.id !== 'string' || !record.id) errors.push(`records[${index}].id is required`);
      else if (ids.has(record.id)) errors.push(`duplicate record id: ${record.id}`);
      else ids.add(record.id);
    });
  }
  return { ok: errors.length === 0, errors, recordCount: Array.isArray(document.records) ? document.records.length : 0 };
}

function main() {
  try {
    const index = process.argv.indexOf('--file');
    if (index < 0 || !process.argv[index + 1]) throw new Error('Usage: backup-validator --file backup.json');
    const raw = fs.readFileSync(process.argv[index + 1]);
    const result = validateBackup(JSON.parse(raw.toString('utf8')));
    result.sha256 = crypto.createHash('sha256').update(raw).digest('hex');
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) main();
module.exports = { validateBackup };
