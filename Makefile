.PHONY: test lint up down doctor verify observability-up observability-down

test:
	npm test

lint:
	npm run lint

up:
	docker compose -f projects/01-containerized-application/compose.yaml up --build -d

down:
	docker compose -f projects/01-containerized-application/compose.yaml down --remove-orphans

doctor:
	node tools/environment-doctor/index.js

verify:
	node tools/deployment-verifier/index.js --url http://localhost:8080

observability-up:
	docker compose -f projects/06-observability/compose.yaml up --build -d

observability-down:
	docker compose -f projects/06-observability/compose.yaml down --remove-orphans
