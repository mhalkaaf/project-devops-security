param([switch]$SkipCreate)

$ErrorActionPreference = 'Stop'
$ProjectRoot = $PSScriptRoot
$RepoRoot = Resolve-Path (Join-Path $ProjectRoot '../..')

if (-not $SkipCreate) {
  kind create cluster --config (Join-Path $ProjectRoot 'kind-config.yaml')
}
docker build -f (Join-Path $RepoRoot 'apps/demo-api/Dockerfile') -t devops-lab/demo-api:local $RepoRoot
kind load docker-image devops-lab/demo-api:local --name devops-lab
kubectl apply -k (Join-Path $ProjectRoot 'manifests')
kubectl rollout status deployment/demo-api -n demo --timeout=120s
node (Join-Path $RepoRoot 'tools/deployment-verifier/index.js') --url http://localhost:8080
