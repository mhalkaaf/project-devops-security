# Troubleshooting

## Port sudah digunakan

Periksa port `8080`, `9090`, dan `3000`. Hentikan lab lain atau ubah host-side port pada Compose; jangan mengubah container port tanpa memperbarui probe dan scrape target.

## ImagePullBackOff pada Kind

Pastikan image sudah dimuat ke cluster:

```powershell
kind load docker-image devops-lab/demo-api:local --name devops-lab
kubectl describe pod -n demo
```

`imagePullPolicy: IfNotPresent` diperlukan untuk image lokal.

## Pod ditolak Pod Security

Periksa `runAsNonRoot`, `allowPrivilegeEscalation`, `seccompProfile`, dan capability drop. Namespace `demo` menerapkan restricted profile.

## Tidak ada metric

1. Buka `http://localhost:8080/metrics`.
2. Periksa log `otel-collector`.
3. Buka Prometheus `/targets` dan pastikan collector up.
4. Generate traffic dengan `node projects/06-observability/load.js`.

## Docker build gagal menyalin source

Build context harus root repository:

```powershell
docker build -f apps/demo-api/Dockerfile -t devops-lab/demo-api:local .
```

## PowerShell menolak script

Jalankan command di dalam script secara manual atau gunakan execution policy yang disetujui organisasi. Jangan menurunkan policy mesin secara permanen hanya untuk lab.
