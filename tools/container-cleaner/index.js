#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

function olderThan(createdAt, days, now = Date.now()) {
  const timestamp = Date.parse(createdAt);
  return Number.isFinite(timestamp) && timestamp < now - days * 86400000;
}

function candidates(images, days, now) {
  return images.filter((image) => image.ID && olderThan(image.CreatedAt, days, now));
}

function main() {
  const execute = process.argv.includes('--execute');
  const daysIndex = process.argv.indexOf('--older-than-days');
  const days = daysIndex >= 0 ? Number(process.argv[daysIndex + 1]) : 7;
  if (!Number.isFinite(days) || days < 1) {
    console.error('--older-than-days must be at least 1');
    process.exitCode = 2;
    return;
  }
  const listing = spawnSync('docker', ['image', 'ls', '--filter', 'dangling=true', '--format', '{{json .}}'], { encoding: 'utf8', windowsHide: true });
  if (listing.error || listing.status !== 0) {
    console.error(listing.stderr || listing.error?.message || 'docker image ls failed');
    process.exitCode = 2;
    return;
  }
  const images = listing.stdout.trim() ? listing.stdout.trim().split(/\r?\n/).map(JSON.parse) : [];
  const selected = candidates(images, days);
  console.log(`${execute ? 'EXECUTE' : 'DRY-RUN'}: ${selected.length} dangling image(s) older than ${days} day(s)`);
  selected.forEach((image) => console.log(`${image.ID} ${image.CreatedAt}`));
  if (!execute || selected.length === 0) return;
  const removal = spawnSync('docker', ['image', 'rm', ...selected.map((image) => image.ID)], { encoding: 'utf8', stdio: 'inherit', windowsHide: true });
  if (removal.status !== 0) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { candidates, olderThan };
