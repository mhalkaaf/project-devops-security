const http = require('node:http');

const port = Number(process.env.PORT ?? 8080);
const server = http.createServer((request, response) => {
  const ready = request.url === '/health/ready';
  response.writeHead(ready ? 200 : 404, { 'content-type': 'application/json' });
  response.end(JSON.stringify(ready ? { status: 'ready' } : { error: 'not_found' }));
});

server.listen(port, '0.0.0.0');
process.on('SIGTERM', () => server.close(() => process.exit(0)));
