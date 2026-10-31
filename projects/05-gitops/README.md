# 05 — GitOps with Argo CD

Kustomize overlays memisahkan konfigurasi `dev` dan `prod`; Argo CD merekonsiliasi desired state dari Git.

## Render sebelum deploy

```powershell
kubectl kustomize projects/05-gitops/overlays/dev
kubectl kustomize projects/05-gitops/overlays/prod
```

Install Argo CD mengikuti dokumentasi resminya, ganti `REPLACE_WITH_YOUR_REPOSITORY_URL`, lalu:

```powershell
kubectl apply -f projects/05-gitops/argocd/project.yaml
kubectl apply -f projects/05-gitops/argocd/application-dev.yaml
```

Untuk penggunaan nyata, pin `targetRevision` ke branch/tag/commit yang dikelola, gunakan repository credential dari secret manager, dan batasi AppProject.

## Failure exercise

Ubah replica langsung dengan `kubectl scale`. Self-heal akan mengembalikannya ke nilai Git. Lalu buat perubahan melalui overlay dan bandingkan audit trail-nya.

## Acceptance criteria

- `kubectl kustomize` menghasilkan manifest valid.
- Argo CD berstatus `Synced` dan `Healthy`.
- Manual drift dikoreksi.
- Perubahan produksi hanya terjadi setelah perubahan Git direview.
