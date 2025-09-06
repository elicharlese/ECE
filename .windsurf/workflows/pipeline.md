---
description: Kilo CI/CD Pipeline bootstrap
---

# /pipeline

Bootstraps the Kilo CI/CD pipeline automation. It:
- Verifies or generates the `.vercel/project.json` via `vercel link --yes` (non-interactive)
- Parses `orgId` and `projectId`
- Validates CI secrets
- Creates `.github/workflows/kilo-pipeline.yml`
- Commits and tags the first version

Requirements:
- GitHub Actions secrets: `VERCEL_TOKEN`, `NPM_TOKEN`
- Optional env variables: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (auto-inferred from `.vercel/project.json`)

_steps:
  - name: Install Vercel CLI (if missing)
    run: |
      cascade run-shell << 'EOF'
      if ! command -v vercel &> /dev/null; then
        npm install -g vercel@latest
      fi
      EOF

  - name: Ensure `.vercel/project.json` exists & capture IDs
    run: |
      cascade run-shell << 'EOF'
      mkdir -p .vercel
      if [ ! -f ".vercel/project.json" ]; then
        echo "⚡ Running: vercel link --yes to generate .vercel/project.json"
        vercel link --yes --token="${VERCEL_TOKEN}"
      fi
      if command -v jq >/dev/null 2>&1; then
        ORG_ID=$(jq -r '.orgId // .scope' .vercel/project.json)
        PROJ_ID=$(jq -r '.projectId' .vercel/project.json)
      else
        ORG_ID="${VERCEL_ORG_ID}"
        PROJ_ID="${VERCEL_PROJECT_ID}"
      fi
      echo "Parsed VERCEL_ORG_ID=$ORG_ID"
      echo "Parsed VERCEL_PROJECT_ID=$PROJ_ID"
      echo "VERCEL_ORG_ID=$ORG_ID" >> $GITHUB_ENV
      echo "VERCEL_PROJECT_ID=$PROJ_ID" >> $GITHUB_ENV
      EOF

  - name: Validate GitHub Secrets
    run: |
      cascade run-shell << 'EOF'
      missing=0
      for s in VERCEL_TOKEN NPM_TOKEN; do
        if [ -z "${!s}" ]; then
          echo "❌ Missing $s"
          missing=1
        fi
      done
      if (( missing )); then
        echo "Please configure required secrets and variables in GitHub."
        exit 1
      fi
      echo "✅ All required CI secrets/vars present"
      EOF

  - name: Generate GitHub Actions YAML (kilo-pipeline.yml)
    run: |
      cascade run-shell << 'EOF'
      mkdir -p .github/workflows
      cat > .github/workflows/kilo-pipeline.yml << 'YAML'
      name: "Kilo CI/CD Pipeline"

      on:
        pull_request:
          branches: [main]
        push:
          branches: [main]

      permissions:
        contents: read
        pull-requests: write
        id-token: write

      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        VERCEL_ORG_ID: ${{ env.VERCEL_ORG_ID }}
        VERCEL_PROJECT_ID: ${{ env.VERCEL_PROJECT_ID }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

      jobs:
        commit-lint:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v5
              with:
                fetch-depth: 0
            - uses: actions/setup-node@v4
              with:
                node-version: '20'
            - run: npm ci --silent
            - uses: wagoid/commitlint-github-action@v9

        build-and-test:
          needs: commit-lint
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v5
            - uses: actions/setup-node@v4
              with:
                node-version: '20'
            - run: npm ci --silent
            - run: npm run lint
            - run: npm run typecheck || npm run type-check || true
            - run: npm run test -- --coverage
            - run: npm run build
            - uses: actions/upload-artifact@v4
              with:
                name: coverage-report
                path: coverage/

        release:
          needs: build-and-test
          if: github.event_name == 'push' && github.ref == 'refs/heads/main'
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v5
              with:
                fetch-depth: 0
            - uses: actions/setup-node@v4
              with:
                node-version: '20'
            - run: npm ci --silent
            - name: Deploy to Vercel (Production)
              uses: amondnet/vercel-action@v25
              with:
                vercel-token: ${{ env.VERCEL_TOKEN }}
                vercel-org-id: ${{ env.VERCEL_ORG_ID }}
                vercel-project-id: ${{ env.VERCEL_PROJECT_ID }}
                vercel-args: '--prod'
      YAML
      EOF

  - name: Commit pipeline and tag
    run: |
      cascade run-shell << 'EOF'
      git add .github/workflows/kilo-pipeline.yml .vercel/project.json || true
      git commit -m "feat(ci): add Kilo CI/CD pipeline with Vercel deploy" || true
      git tag -a v0.1.0 -m "Kilo CI/CD bootstrap"
      EOF

  - name: Pipeline bootstrap complete
    run: |
      echo "✅ Kilo CI/CD pipeline added (kilo-pipeline.yml) and tagged v0.1.0"
