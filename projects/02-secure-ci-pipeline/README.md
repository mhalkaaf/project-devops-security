# 02 — Secure CI Pipeline

Workflow terpadu terdapat di `.github/workflows/pipeline.yml` karena GitHub hanya membaca workflow dari lokasi tersebut.

## Quality gates

1. `quality`: lint dan unit test.
2. `manifests` dan `source-security`: render Helm/Kustomize, scan manifest, test Kyverno, serta scan source secara paralel.
3. `container`: build dan scan image, lalu membuat SBOM sebagai artifact.
4. `publish`: push image hanya dari branch/tag tepercaya dan menandatangani tag rilis dengan OIDC.

Pipeline memakai permission minimum, action yang dipin ke major release, concurrency cancellation, dan tidak melakukan push image dari pull request.

## Praktik

Jalankan padanan lokal sebelum push:

```powershell
npm run lint
npm test
docker build -f apps/demo-api/Dockerfile -t devops-lab/demo-api:ci .
trivy fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL .
```

## Failure exercise

- Tambahkan test yang gagal dan amati quality gate.
- Ubah `USER node` menjadi `USER root`; scan/config policy harus menolak perubahan.
- Tambahkan string dummy yang cocok dengan secret rule lalu pastikan scanner menghentikan pipeline. Jangan gunakan secret nyata.

## Acceptance criteria

- Pull request tidak dapat melewati test gagal.
- Image hanya dipublikasikan dari branch default atau tag.
- Laporan scan dan SBOM tersedia sebagai artifact.
