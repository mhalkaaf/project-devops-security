# Container Cleaner

Memilih hanya dangling image yang lebih tua dari batas tertentu. Default selalu dry-run.

```powershell
node tools/container-cleaner/index.js --older-than-days 7
node tools/container-cleaner/index.js --older-than-days 7 --execute
```

`--execute` menghapus ID yang sudah ditampilkan; container, volume, dan image bertag tidak disentuh.
