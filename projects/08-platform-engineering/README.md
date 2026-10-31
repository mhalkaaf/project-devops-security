# 08 — Platform Engineering

Template Backstage ini adalah contoh golden path: tim aplikasi mengisi nama, owner, dan lokasi repository; platform menghasilkan skeleton aman, mempublikasikan repository, lalu mendaftarkannya ke software catalog.

## Sebelum digunakan

- Konfigurasikan Backstage authentication dan permission framework.
- Konfigurasikan GitHub integration dengan credential minimum.
- Sesuaikan organisasi yang diizinkan pada `RepoUrlPicker`.
- Perbarui annotation catalog sesuai format owner/repository organisasi.
- Tambahkan workflow CI, deployment template, observability, dan policy organisasi ke skeleton.

Register `template/template.yaml` pada catalog Backstage lalu buka halaman `/create`.

## Acceptance criteria

- Input nama yang tidak sesuai DNS ditolak.
- Repository baru memiliki owner dan branch protection.
- Component serta API muncul di catalog.
- Template dapat diuji dengan dry-run sebelum publikasi.

Platform engineering bukan portal semata. Ukur lead time, deployment failure rate, waktu onboarding, dan kepuasan developer sebelum dan setelah golden path diterapkan.
