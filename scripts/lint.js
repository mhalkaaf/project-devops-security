const fs = require('node:fs');
const path = require('node:path');

const roots = ['apps', 'tools', 'scripts'];
const ignored = new Set(['node_modules', '.git']);
const failures = [];

function visit(target) {
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) visit(fullPath);
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      lines.forEach((line, index) => {
        if (/\s+$/.test(line)) failures.push(`${fullPath}:${index + 1}: trailing whitespace`);
        if (line.includes('\t')) failures.push(`${fullPath}:${index + 1}: tab character`);
      });
    }
  }
}

roots.filter(fs.existsSync).forEach(visit);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Lint passed');
