# 01 — Containerized Application

## Tujuan

Membangun runtime contract yang konsisten: process non-root, filesystem read-only, health check, graceful shutdown, resource limit, dan structured logs.

## Praktik

```powershell
docker compose -f projects/01-containerized-application/compose.yaml up --build -d
docker compose -f projects/01-containerized-application/compose.yaml ps
node tools/deployment-verifier/index.js --url http://localhost:8080
docker inspect devops-lab/demo-api:local --format '{{.Config.User}}'
```

Eksperimen kegagalan:

```powershell
$env:ERROR_RATE='0.5'
$env:LATENCY_MS='1000'
docker compose -f projects/01-containerized-application/compose.yaml up --build -d
```

Panggil `/api/work` beberapa kali dan amati JSON log serta hasil verifier.

## Acceptance criteria

- Container healthy dan API dapat diakses di port `8080`.
- Nilai user image bukan `root`.
- Menulis ke filesystem aplikasi ditolak.
- `SIGTERM` menghasilkan log `shutdown_started`.
- Verifier mendeteksi error injection.

## Cleanup

```powershell
docker compose -f projects/01-containerized-application/compose.yaml down --remove-orphans
```
