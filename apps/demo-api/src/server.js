const http = require('node:http');
const { handler } = require('./app');

const port = Number(process.env.PORT ?? 8080);
const graceMs = Number(process.env.SHUTDOWN_GRACE_MS ?? 5000);
const server = http.createServer(handler);

server.listen(port, '0.0.0.0', () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(), level: 'info', message: 'server_started', port, version: process.env.APP_VERSION ?? 'dev',
  }));
});

function shutdown(signal) {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'info', message: 'shutdown_started', signal }));
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), graceMs).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
