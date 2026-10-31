run "dev_environment" {
  command = plan

  variables {
    environment = "dev"
    owner       = "platform-team"
    replicas    = 1
  }

  assert {
    condition     = output.environment_contract.name == "demo-api-dev"
    error_message = "The service name must include the environment."
  }
}

run "production_redundancy" {
  command = plan

  variables {
    environment = "prod"
    owner       = "platform-team"
    replicas    = 2
  }

  assert {
    condition     = output.environment_contract.replicas >= 2
    error_message = "Production must be redundant."
  }
}
