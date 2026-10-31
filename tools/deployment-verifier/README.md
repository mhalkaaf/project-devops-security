# Deployment Verifier

Menunggu liveness, readiness, dan smoke test berhasil. Exit code `1` berarti verifikasi gagal; exit code `2` berarti input CLI tidak valid.

```powershell
node tools/deployment-verifier/index.js --url http://localhost:8080 --retries 10 --interval 2000
```
