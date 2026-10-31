# Operations Runbook

## High error rate

**Trigger:** `DemoApiHighErrorRate` firing.

1. Konfirmasi impact melalui request rate dan rasio status `5xx`.
2. Periksa perubahan terakhir pada image, environment, dan GitOps sync.
3. Cari structured log dengan `status=500` dan korelasikan `requestId`.
4. Pada lab, periksa `ERROR_RATE`; kembalikan ke `0` sebagai mitigasi.
5. Jika dipicu release, rollback ke image digest terakhir yang sehat.
6. Jalankan deployment verifier dan amati minimal lima menit.
7. Catat timeline, penyebab, impact, dan tindak lanjut tanpa menyalahkan individu.

## Target down

**Trigger:** `DemoApiTargetDown` firing atau tidak ada metric baru.

1. Periksa `docker compose ps` atau `kubectl get pods`.
2. Periksa health endpoint aplikasi secara langsung.
3. Periksa log OpenTelemetry Collector dan target Prometheus.
4. Validasi network policy, DNS, dan port `8080/8889`.
5. Restart hanya setelah penyebab dicatat; restart bukan diagnosis.

## Failed Kubernetes rollout

1. `kubectl rollout status deployment/demo-api -n demo`.
2. `kubectl get pods -n demo` dan `kubectl describe pod <pod> -n demo`.
3. Bandingkan event probe, image pull, quota, dan scheduling.
4. Jika replica sehat lama masih tersedia, hentikan perubahan dan jalankan `kubectl rollout undo deployment/demo-api -n demo`.
5. Verifikasi endpoint dengan deployment verifier.

## Suspected credential exposure

1. Jangan menyalin secret ke issue atau chat.
2. Cabut/rotasi credential pada provider terlebih dahulu.
3. Identifikasi scope, akses, dan audit event.
4. Hapus secret dari versi aktif; history rewriting membutuhkan koordinasi karena mengubah commit ID.
5. Tambahkan detection rule dan dokumentasikan incident.
