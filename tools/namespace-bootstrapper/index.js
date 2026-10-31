#!/usr/bin/env node
const fs = require('node:fs');

function safeName(value) {
  if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(value) || value.length > 63) throw new Error('Namespace must be a valid DNS label');
  return value;
}

function render(name) {
  name = safeName(name);
  return `apiVersion: v1
kind: Namespace
metadata:
  name: ${name}
  labels:
    app.kubernetes.io/managed-by: namespace-bootstrapper
    pod-security.kubernetes.io/enforce: restricted
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: default-quota
  namespace: ${name}
spec:
  hard:
    requests.cpu: "2"
    requests.memory: 2Gi
    limits.cpu: "4"
    limits.memory: 4Gi
    pods: "20"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: ${name}
spec:
  limits:
    - type: Container
      defaultRequest:
        cpu: 50m
        memory: 64Mi
      default:
        cpu: 500m
        memory: 512Mi
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: ${name}
spec:
  podSelector: {}
  policyTypes: [Ingress]
`;
}

function main() {
  try {
    const nameIndex = process.argv.indexOf('--name');
    if (nameIndex < 0 || !process.argv[nameIndex + 1]) throw new Error('Usage: namespace-bootstrapper --name NAME [--output FILE]');
    const yaml = render(process.argv[nameIndex + 1]);
    const outputIndex = process.argv.indexOf('--output');
    if (outputIndex >= 0) fs.writeFileSync(process.argv[outputIndex + 1], yaml, { flag: 'wx' });
    else process.stdout.write(yaml);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) main();
module.exports = { render, safeName };
