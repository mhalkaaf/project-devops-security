# 03 — Infrastructure as Code

Lab provider-free ini mengajarkan variable validation, locals, dependency graph, lifecycle precondition, state, plan JSON, output contract, dan native test tanpa membuat resource berbayar.

```powershell
cd projects/03-infrastructure-as-code
tofu fmt -check -recursive
tofu init
tofu validate
tofu test
tofu plan -var-file dev.tfvars -out tfplan
tofu show -json tfplan > plan.json
node ../../tools/iac-drift-reporter/index.js --input plan.json
```

## Failure exercise

Ubah `environment` menjadi nilai yang tidak valid atau gunakan satu replica untuk `prod`. Pelajari kapan validation dan precondition dievaluasi.

## State

State lokal sengaja digunakan hanya untuk lab. Pada tim nyata gunakan encrypted remote backend, locking, access control, audit log, dan pemisahan state per blast radius. Jangan commit file state karena dapat memuat informasi sensitif.

## Acceptance criteria

- `tofu fmt`, `validate`, dan `test` berhasil.
- Plan dapat diringkas oleh drift reporter.
- Konfigurasi production dengan satu replica ditolak.

Cleanup: `tofu destroy -var-file dev.tfvars`, lalu hapus artifact plan lokal.
