# IaC Drift Reporter

Mengubah JSON plan OpenTofu menjadi ringkasan perubahan dan risk level. Penghapusan atau replacement menghasilkan exit code `1`.

```powershell
tofu plan -out tfplan
tofu show -json tfplan > plan.json
node tools/iac-drift-reporter/index.js --input plan.json
```
