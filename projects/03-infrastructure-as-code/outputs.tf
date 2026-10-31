output "environment_contract" {
  description = "Contract that downstream deployment automation can consume."
  value = {
    id       = terraform_data.environment.id
    name     = local.name
    replicas = var.replicas
    tags     = local.common_tags
    endpoint = "http://${local.name}:8080"
  }
}
