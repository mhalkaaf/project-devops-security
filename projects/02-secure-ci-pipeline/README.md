# 02 — Secure CI Pipeline

Workflow terdapat di `.github/workflows` karena GitHub hanya membaca workflow dari lokasi tersebut.

## Quality gates

1. `ci.yml`: lint dan unit test pada setiap pull request.
2. `container.yml`: build image, smoke test, dan upload artifact metadata.
3. `security.yml`: Trivy filesystem/config scan serta SBOM.
4. `manifests.yml`: Helm render dan Kyverno policy test.

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
