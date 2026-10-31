# 07 — DevSecOps Supply Chain

## Security gates

```text
source -> secret/IaC scan -> test -> image -> vulnerability scan
       -> SBOM -> registry -> keyless signature -> admission policy
```

## Jalankan lokal

```powershell
trivy fs --scanners vuln,misconfig,secret --secret-config projects/07-devsecops-pipeline/trivy-secret.yaml --severity HIGH,CRITICAL --exit-code 1 .
docker build -f apps/demo-api/Dockerfile -t devops-lab/demo-api:local .
trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 devops-lab/demo-api:local
./projects/07-devsecops-pipeline/generate-sbom.ps1
kyverno test projects/07-devsecops-pipeline/tests
```

Workflow container pada tag menggunakan OIDC untuk keyless signing. Jangan menyimpan private signing key di repository. Untuk registry privat, batasi token ke package/repository yang diperlukan dan gunakan identity berumur pendek.

## Policy lifecycle

1. Jalankan policy dalam audit mode.
2. Ukur violation dan perbaiki workload.
3. Tambahkan exception yang mempunyai owner, alasan, dan tanggal kedaluwarsa.
4. Ubah menjadi enforce setelah false positive dipahami.
5. Test policy pada CI sebelum diterapkan ke cluster.

## Acceptance criteria

- Secret dummy dengan format `LAB_TOKEN=<16-karakter-acak>` ditolak scanner.
- Insecure pod gagal pada Kyverno test.
- SBOM SPDX dapat dibuat dari image.
- Critical vulnerability menghentikan pipeline sesuai kebijakan.
- Signature image dapat diverifikasi terhadap identity workflow yang diizinkan.
