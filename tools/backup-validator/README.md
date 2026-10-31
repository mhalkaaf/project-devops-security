# Backup Validator

Contoh restore-integrity gate untuk backup JSON. Tool memeriksa schema, tanggal, duplicate ID, jumlah record, dan menghasilkan SHA-256.

```powershell
node tools/backup-validator/index.js --file tools/backup-validator/sample-backup.json
```

Dalam sistem nyata, perluas adapter agar backup direstore ke database sementara lalu jalankan query integritas.
