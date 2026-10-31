# Contributing

## Alur perubahan

1. Buat branch kecil dengan satu tujuan.
2. Tambahkan atau perbarui test dan dokumentasi.
3. Jalankan `npm test` dan `npm run lint`.
4. Pastikan tidak ada credential, private key, atau token dalam diff.
5. Jelaskan risiko, cara verifikasi, dan rollback pada pull request.

## Definition of done

- Happy path dan minimal satu failure path teruji.
- Automation bersifat idempotent jika memungkinkan.
- Operasi destruktif mempunyai `--dry-run` atau konfirmasi eksplisit.
- Log tidak membocorkan secret.
- Dokumentasi mencantumkan prasyarat dan cleanup.
- Manifest mempunyai resource request/limit dan security context.

Gunakan Conventional Commits seperti `feat:`, `fix:`, `docs:`, dan `chore:`.
