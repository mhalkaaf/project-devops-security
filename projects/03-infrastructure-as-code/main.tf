locals {
  name = "demo-api-${var.environment}"
  common_tags = {
    application = "demo-api"
    environment = var.environment
    managed_by  = "opentofu"
    owner       = var.owner
  }
}

# terraform_data is built into OpenTofu. It makes this first lab safe, local,
# and provider-free while still teaching dependency graphs and replacement.
resource "terraform_data" "environment" {
  input = {
    name     = local.name
    replicas = var.replicas
    tags     = local.common_tags
  }
}

resource "terraform_data" "application" {
  input = {
    environment_id = terraform_data.environment.id
    service_name    = local.name
    port            = 8080
  }

  lifecycle {
    precondition {
      condition     = var.environment != "prod" || var.replicas >= 2
      error_message = "prod requires at least two replicas."
    }
  }
}
