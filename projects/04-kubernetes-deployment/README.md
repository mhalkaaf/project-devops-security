# 04 — Kubernetes Deployment

## Jalankan

```powershell
./projects/04-kubernetes-deployment/bootstrap.ps1
kubectl get all -n demo
kubectl describe deployment demo-api -n demo
```

Script membuat cluster Kind dua node, membangun dan memuat image lokal, menerapkan manifest, menunggu rollout, lalu menjalankan smoke test.

## Failure exercise

```powershell
kubectl set env deployment/demo-api READY=false -n demo
kubectl rollout status deployment/demo-api -n demo --timeout=30s
kubectl rollout undo deployment/demo-api -n demo
```

Amati perbedaan startup, readiness, dan liveness probe. Uji juga drain pada worker untuk melihat peran replica dan PodDisruptionBudget.

## Acceptance criteria

- Dua pod berjalan non-root dan Ready.
- Service dapat diakses dari `http://localhost:8080`.
- Rollout dengan readiness gagal tidak menggantikan seluruh pod sehat.
- `kubectl auth can-i --as=system:serviceaccount:demo:demo-api get secrets -n demo` menjawab `no`.

## Cleanup

```powershell
kind delete cluster --name devops-lab
```
