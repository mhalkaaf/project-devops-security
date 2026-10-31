# Environment Doctor

Memeriksa tool yang diperlukan tanpa mengubah workstation.

```powershell
node tools/environment-doctor/index.js
node tools/environment-doctor/index.js --json
node tools/environment-doctor/index.js --strict
```

Mode `--strict` gagal jika tool opsional belum tersedia dan cocok dipakai untuk menyiapkan runner khusus.
