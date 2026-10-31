# 06 — Observability

Alur metric: `demo-api -> OpenTelemetry Collector -> Prometheus -> Grafana`. Collector menjadi lapisan vendor-neutral dan Prometheus menyimpan serta mengevaluasi alert.

```powershell
docker compose -f projects/06-observability/compose.yaml up --build -d
node projects/06-observability/load.js http://localhost:8080 200 10
```

- API: <http://localhost:8080>
- Prometheus: <http://localhost:9090>
- Grafana: <http://localhost:3000> (`admin` / `devops-lab`, hanya untuk lokal)

## Incident exercise

```powershell
$env:ERROR_RATE='0.25'
$env:LATENCY_MS='500'
docker compose -f projects/06-observability/compose.yaml up -d
node projects/06-observability/load.js http://localhost:8080 500 20
```

Gunakan dashboard, query Prometheus, structured container log, dan `docs/runbook.md`. Kembalikan environment ke `0` untuk mitigasi.

## Acceptance criteria

- Dashboard menampilkan request rate dan error ratio.
- Alert berubah menjadi pending/firing saat error berlangsung.
- Operator dapat menghubungkan gejala, perubahan konfigurasi, dan log request ID.

Cleanup: `docker compose -f projects/06-observability/compose.yaml down --remove-orphans`.
