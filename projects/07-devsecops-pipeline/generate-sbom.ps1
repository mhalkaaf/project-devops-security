param(
  [string]$Image = 'devops-lab/demo-api:local',
  [string]$Output = 'artifacts/demo-api-sbom.spdx.json'
)

$ErrorActionPreference = 'Stop'
$OutputPath = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '../..')) $Output
$OutputDirectory = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
syft $Image -o "spdx-json=$OutputPath"
Write-Host "SBOM written to $OutputPath"
