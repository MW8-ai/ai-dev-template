# Workflow Templates

These GitHub Actions workflow files are reusable starting points.

Use the active workflows in `.github/workflows/` for this repository. Copy files from this folder when starting another repo.

Recommended minimum set:

- `00-repo-health.yml`
- `01-pr-standards.yml`
- `02-docs-quality.yml`
- `03-security-supply-chain.yml`
- `04-codeql.yml`
- `05-actions-lint.yml`

For release or package-producing repositories, also review:

- `06-build-provenance-example.yml`
