# DevOps & DevSecOps Learning Lab

Repository ini adalah laboratorium local-first untuk mempelajari alur hidup aplikasi dari source code sampai operasi produksi. Satu aplikasi demo dipakai di seluruh proyek agar hubungan antara container, CI/CD, Infrastructure as Code, Kubernetes, GitOps, observability, security, dan platform engineering terlihat jelas.

## Hasil yang dipelajari

```text
source -> test -> container -> scan -> sign -> deploy -> observe -> operate
                  |                    |
                  +-- policy as code --+
```

| Folder | Fokus | Hasil akhir |
| --- | --- | --- |
| `projects/01-containerized-application` | Docker dan runtime contract | Image non-root dengan health check |
| `projects/02-secure-ci-pipeline` | CI dan quality gates | Pipeline test, build, dan scan |
| `projects/03-infrastructure-as-code` | OpenTofu | Module, state, validation, dan test |
| `projects/04-kubernetes-deployment` | Kubernetes dan Helm | Deployment dengan probe dan resource limit |
| `projects/05-gitops` | Argo CD dan Kustomize | Git sebagai desired state |
| `projects/06-observability` | Metrics, dashboard, dan alert | Investigasi latency dan error |
| `projects/07-devsecops-pipeline` | Trivy, Kyverno, SBOM, Cosign | Supply-chain security gates |
| `projects/08-platform-engineering` | Backstage template | Golden path self-service |
| `tools` | Automation utilities | CLI untuk tugas operasional berulang |

## Prasyarat

Minimum:

- Git
- Docker Desktop atau Docker Engine
- Node.js 20 atau lebih baru

Untuk lab Kubernetes dan GitOps: `kubectl`, `kind`, dan `helm`. Untuk lab tambahan: OpenTofu, Trivy, Kyverno CLI, Cosign, dan Syft. Jalankan environment doctor untuk melihat apa yang sudah tersedia:

```powershell
node tools/environment-doctor/index.js
```

## Mulai cepat

```powershell
npm test
npm start
docker compose -f projects/01-containerized-application/compose.yaml up --build
node tools/deployment-verifier/index.js --url http://localhost:8080
```

Endpoint aplikasi:

- `GET /` — informasi aplikasi
- `GET /health/live` — liveness
- `GET /health/ready` — readiness
- `GET /api/work` — workload yang dapat diberi latency/error
- `GET /metrics` — Prometheus metrics

## Perintah umum

```powershell
./scripts/lab.ps1 test
./scripts/lab.ps1 compose-up
./scripts/lab.ps1 compose-down
./scripts/lab.ps1 doctor
./scripts/lab.ps1 verify
```

Di Linux/macOS, perintah yang sama tersedia melalui `make test`, `make up`, `make down`, `make doctor`, dan `make verify`.

## Cara menggunakan repository

Ikuti folder `projects` secara berurutan. Masing-masing memiliki tujuan, langkah praktik, acceptance criteria, failure exercise, serta cleanup. Jangan hanya menjalankan happy path: aktifkan error injection, rusak manifest secara sengaja, baca alert, dan ikuti runbook.

Seluruh contoh aman dijalankan secara lokal. Perintah yang menghapus resource menyediakan scope eksplisit atau mode dry-run. Jangan memasukkan credential asli ke repository; gunakan `.env` lokal, secret manager, atau short-lived identity.

## Dokumentasi

- [Arsitektur](docs/architecture.md)
- [Roadmap belajar](docs/roadmap.md)
- [Runbook](docs/runbook.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Konvensi kontribusi](CONTRIBUTING.md)

## Lisensi

Kode contoh menggunakan [MIT License](LICENSE).
