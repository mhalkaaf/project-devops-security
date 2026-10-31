param(
  [Parameter(Position = 0)]
  [ValidateSet('test', 'lint', 'compose-up', 'compose-down', 'observability-up', 'observability-down', 'doctor', 'verify')]
  [string]$Command = 'test'
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

switch ($Command) {
  'test' { npm test }
  'lint' { npm run lint }
  'compose-up' { docker compose -f projects/01-containerized-application/compose.yaml up --build -d }
  'compose-down' { docker compose -f projects/01-containerized-application/compose.yaml down --remove-orphans }
  'observability-up' { docker compose -f projects/06-observability/compose.yaml up --build -d }
  'observability-down' { docker compose -f projects/06-observability/compose.yaml down --remove-orphans }
  'doctor' { node tools/environment-doctor/index.js }
  'verify' { node tools/deployment-verifier/index.js --url http://localhost:8080 }
}

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
