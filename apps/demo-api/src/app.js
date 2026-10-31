const { randomUUID } = require('node:crypto');

const counters = { requests: new Map(), workDurationMs: [], startedAt: Date.now() };

function numberFromEnv(name, fallback, minimum, maximum) {
  const parsed = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function increment(method, route, status) {
  const key = `${method}|${route}|${status}`;
  counters.requests.set(key, (counters.requests.get(key) ?? 0) + 1);
}

function sendJson(response, status, body, requestId) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
    'x-request-id': requestId,
  });
  response.end(payload);
}

function metrics() {
  const version = String(process.env.APP_VERSION ?? 'dev').replaceAll('"', '');
  const lines = [
    '# HELP demo_api_info Build information for the demo API.',
    '# TYPE demo_api_info gauge',
    `demo_api_info{version="${version}"} 1`,
    '# HELP demo_api_uptime_seconds Process uptime in seconds.',
    '# TYPE demo_api_uptime_seconds gauge',
    `demo_api_uptime_seconds ${Math.floor((Date.now() - counters.startedAt) / 1000)}`,
    '# HELP demo_api_requests_total HTTP requests processed.',
    '# TYPE demo_api_requests_total counter',
  ];
  for (const [key, value] of counters.requests.entries()) {
    const [method, route, status] = key.split('|');
    lines.push(`demo_api_requests_total{method="${method}",route="${route}",status="${status}"} ${value}`);
  }
  const count = counters.workDurationMs.length;
  const sum = counters.workDurationMs.reduce((total, item) => total + item, 0);
  lines.push('# HELP demo_api_work_duration_milliseconds Time spent in simulated work.');
  lines.push('# TYPE demo_api_work_duration_milliseconds summary');
  lines.push(`demo_api_work_duration_milliseconds_count ${count}`);
  lines.push(`demo_api_work_duration_milliseconds_sum ${sum}`);
  return `${lines.join('\n')}\n`;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function handler(request, response) {
  const requestId = request.headers['x-request-id'] || randomUUID();
  const url = new URL(request.url, 'http://localhost');
  const route = url.pathname;
  const started = Date.now();

  response.on('finish', () => {
    increment(request.method, route, response.statusCode);
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: response.statusCode >= 500 ? 'error' : 'info',
      requestId,
      method: request.method,
      route,
      status: response.statusCode,
      durationMs: Date.now() - started,
    }));
  });

  if (request.method !== 'GET') return sendJson(response, 405, { error: 'method_not_allowed', requestId }, requestId);
  if (route === '/') {
    return sendJson(response, 200, {
      name: 'demo-api', version: process.env.APP_VERSION ?? 'dev', environment: process.env.APP_ENV ?? 'local', requestId,
    }, requestId);
  }
  if (route === '/health/live') return sendJson(response, 200, { status: 'alive' }, requestId);
  if (route === '/health/ready') {
    const ready = String(process.env.READY ?? 'true').toLowerCase() === 'true';
    return sendJson(response, ready ? 200 : 503, { status: ready ? 'ready' : 'not_ready' }, requestId);
  }
  if (route === '/api/work') {
    const latency = numberFromEnv('LATENCY_MS', 0, 0, 30_000);
    const errorRate = numberFromEnv('ERROR_RATE', 0, 0, 1);
    await sleep(latency);
    counters.workDurationMs.push(Date.now() - started);
    if (counters.workDurationMs.length > 1000) counters.workDurationMs.shift();
    if (Math.random() < errorRate) return sendJson(response, 500, { error: 'simulated_failure', requestId }, requestId);
    return sendJson(response, 200, { status: 'completed', latencyMs: latency, requestId }, requestId);
  }
  if (route === '/metrics') {
    const payload = metrics();
    response.writeHead(200, {
      'content-type': 'text/plain; version=0.0.4; charset=utf-8',
      'content-length': Buffer.byteLength(payload),
      'cache-control': 'no-store',
    });
    return response.end(payload);
  }
  return sendJson(response, 404, { error: 'not_found', requestId }, requestId);
}

module.exports = { handler, metrics, numberFromEnv };
