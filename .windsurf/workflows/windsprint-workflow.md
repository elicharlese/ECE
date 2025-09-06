---
description: Full Windsurf ↔ Kilo patch/batch spiral orchestrator
---

# /windsprint-workflow

Launches the full patch→batch spiral: scaffolds docs, configures CI/CD, plans features, develops, deploys via Kilo, and spins up the next cycle—automatically looping until `END_GOAL.md` is fully checked.

## Steps

1. Call `/bootstrap-templates`
   - Scaffolds docs/guidelines.md, END_GOAL.md, README.md, optional `.windsurfrules.md`
   - Commits with tag `v0.0.1`

2. Wait for human confirmation (or check `v0.0.1` tag)

3. Call `/pipeline`
   - Reads `.vercel/project.json` and existing secrets
   - Writes `.github/workflows/kilo-pipeline.yml`
   - Commits + tags (e.g. `v0.1.0`) for Kilo CI/CD activation

4. Loop (until `END_GOAL.md` all ✅):
   a. Call `/plan-feature-set` to generate patch checklist and default CLI flag commands
   b. Call `/batch-start-N` (auto-increment N)
   c. Develop in `windsprint/batch-N` branch with flags-only CLIs, then self-check: lint / typecheck / tests / flag compliance
   d. Merge branch into `main`
   e. Kilo CI/CD executes → lint → test → build → deploy
   f. Call `/release-sync` to close batch and open the next cycle

## Notes
- Divergence (flag misuse, stack changes) is audited via `PATCHN_ISSUES.md` or `proposed-tech/...` branches.
- Loop terminates only when all items in `END_GOAL.md` are satisfied.
