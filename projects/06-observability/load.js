const baseUrl = process.argv[2] ?? 'http://localhost:8080';
const requests = Number(process.argv[3] ?? 100);
const concurrency = Number(process.argv[4] ?? 5);

async function worker(state) {
  while (state.next < requests) {
    state.next += 1;
    try {
      const response = await fetch(`${baseUrl}/api/work`);
      state.status[response.status] = (state.status[response.status] ?? 0) + 1;
    } catch {
      state.status.network_error = (state.status.network_error ?? 0) + 1;
    }
  }
}

async function main() {
  const state = { next: 0, status: {} };
  await Promise.all(Array.from({ length: concurrency }, () => worker(state)));
  console.log(JSON.stringify(state.status, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
