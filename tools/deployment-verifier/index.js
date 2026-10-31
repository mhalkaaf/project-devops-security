#!/usr/bin/env node

function parseArgs(argv) {
  const config = { url: 'http://localhost:8080', retries: 5, interval: 1000, timeout: 3000 };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--url') config.url = argv[++index];
    else if (value === '--retries') config.retries = Number(argv[++index]);
    else if (value === '--interval') config.interval = Number(argv[++index]);
    else if (value === '--timeout') config.timeout = Number(argv[++index]);
    else if (value === '--json') config.json = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!Number.isInteger(config.retries) || config.retries < 1) throw new Error('--retries must be a positive integer');
  return config;
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function check(baseUrl, path, timeout, fetcher = fetch) {
  const started = Date.now();
  try {
    const response = await fetcher(new URL(path, baseUrl), { signal: AbortSignal.timeout(timeout) });
    return { path, ok: response.ok, status: response.status, durationMs: Date.now() - started };
  } catch (error) {
    return { path, ok: false, status: null, durationMs: Date.now() - started, error: error.message };
  }
}

async function verify(config, fetcher = fetch) {
  let lastChecks = [];
  for (let attempt = 1; attempt <= config.retries; attempt += 1) {
    lastChecks = await Promise.all([
      check(config.url, '/health/live', config.timeout, fetcher),
      check(config.url, '/health/ready', config.timeout, fetcher),
      check(config.url, '/api/work', config.timeout, fetcher),
    ]);
    if (lastChecks.every((item) => item.ok)) return { ok: true, attempt, checks: lastChecks };
    if (attempt < config.retries) await delay(config.interval);
  }
  return { ok: false, attempt: config.retries, checks: lastChecks };
}

async function main() {
  try {
    const config = parseArgs(process.argv.slice(2));
    const result = await verify(config);
    if (config.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`Deployment verification: ${result.ok ? 'PASSED' : 'FAILED'} (attempt ${result.attempt})`);
      result.checks.forEach((item) => console.log(`${item.ok ? 'OK  ' : 'FAIL'} ${item.path} status=${item.status ?? '-'} duration=${item.durationMs}ms`));
    }
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) main();
module.exports = { check, parseArgs, verify };
