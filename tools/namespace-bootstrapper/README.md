# Namespace Bootstrapper

Menghasilkan baseline namespace yang berisi Pod Security label, ResourceQuota, LimitRange, dan default-deny ingress.

```powershell
node tools/namespace-bootstrapper/index.js --name team-demo --output team-demo.yaml
kubectl apply -f team-demo.yaml
```

Output file menggunakan create-only mode agar file lama tidak tertimpa tanpa sengaja.
