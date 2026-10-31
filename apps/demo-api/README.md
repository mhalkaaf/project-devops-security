# Demo API

API Node.js tanpa dependency eksternal yang menjadi workload seluruh lab. Aplikasi mempunyai health endpoint, Prometheus metrics, structured JSON logs, graceful shutdown, request ID, dan fault injection.

## Fault injection

```powershell
$env:LATENCY_MS = '750'
$env:ERROR_RATE = '0.25'
npm start
```

`LATENCY_MS` menambah delay pada `/api/work`. `ERROR_RATE` menerima angka `0` sampai `1`. Gunakan hanya untuk lab dan jangan menerapkan pola fault injection berbasis environment ini apa adanya di produksi.
