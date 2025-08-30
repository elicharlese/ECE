# Feature Mapping

This document maps legacy patch-numbered docs from `docs/patches/patch-*` to feature-based folders under `patches/`. References below point to the new locations.

- Note: Status is taken from each patch document when explicitly stated; otherwise marked as "Unspecified".
- Source docs have been copied into the feature folders' `sources/`. After final verification, we will remove the legacy `docs/patches/patch-*` folders.

## Legend

- Feature Folder → Included Patches (Status) → Key Docs

## Mapping

1. 3D & Visualization (`patches/3d-visualization/`)

- Patch 6 (Planned) → `patches/3d-visualization/sources/PATCH6_SUMMARY.md`

1. Enterprise & Compliance (`patches/enterprise-compliance/`)

- Patch 7 (Planned) → `patches/enterprise-compliance/sources/PATCH7_SUMMARY.md`

1. CLI & Automation (`patches/cli-development-automation/`)

- Patch 8 (Planned) → `patches/cli-development-automation/sources/PATCH8_SUMMARY.md`
- Patch 17 (Unspecified) → `patches/cli-development-automation/sources/overview.md`, `patches/cli-development-automation/sources/checklist.md`

1. Social & Community (`patches/social-community/`)

- Patch 9 (Planned) → `patches/social-community/sources/PATCH9_SUMMARY.md`

1. AI & Analytics (`patches/ai-analytics/`)

- Patch 10 (Planned) → `patches/ai-analytics/sources/PATCH10_SUMMARY.md`

1. Order Flow & App Generation + GitHub MCP (`patches/app-generation-pipeline-nebius/`)

- Patch 11 (Unspecified) → `patches/app-generation-pipeline-nebius/sources/PATCH11_SUMMARY.md`, `patches/app-generation-pipeline-nebius/sources/PATCH11_CHECKLIST.md`
- Patch 13 (Completed) → `patches/app-generation-pipeline-nebius/sources/PATCH13_COMPLETION_SUMMARY.md`, `patches/app-generation-pipeline-nebius/sources/PATCH13_CHECKLIST.md`, `patches/app-generation-pipeline-nebius/sources/NEBIUS_INTEGRATION_COMPLETE.md`, `patches/app-generation-pipeline-nebius/sources/PIPELINE_AUDIT_REPORT.md`

1. Quality Standards & Design System (`patches/quality-design-system/`)

- Patch 12 (Unspecified) → `patches/quality-design-system/sources/PATCH12_SUMMARY.md`, `patches/quality-design-system/sources/PATCH12_CHECKLIST.md`, `patches/quality-design-system/sources/PATCH12_STATUS_REPORT.md`, `patches/quality-design-system/sources/QUALITY_STANDARDS_FRAMEWORK.md`

1. Production Setup & Environment Configuration (`patches/production-setup-env/`)

- Patch 14 (Unspecified) → `patches/production-setup-env/sources/NEBIUS_PRODUCTION_SETUP.md`, `patches/production-setup-env/sources/PATCH14_CHECKLIST.md`

1. Advanced Tool Integration & Design Enhancements (`patches/tools-design-enhancements/`)

- Patch 15 (Completed) → `patches/tools-design-enhancements/sources/PATCH15_COMPLETION_SUMMARY.md`, `patches/tools-design-enhancements/sources/PATCH15_CHECKLIST.md`, `patches/tools-design-enhancements/sources/README.md`

1. Profile & Branding Enhancements (`patches/profile-branding/`)

- Patch 16 (Unspecified) → `patches/profile-branding/sources/overview.md`, `patches/profile-branding/sources/checklist.md`

1. App Pipeline & Admin Dashboard (`patches/app-pipeline-admin-dashboard/`)

- Patch 18 (Unspecified) → `patches/app-pipeline-admin-dashboard/sources/overview.md`, `patches/app-pipeline-admin-dashboard/sources/checklist.md`

1. Scaling & Quality Assurance (`patches/scaling-quality-assurance/`)

- Patch 19 (Unspecified) → `patches/scaling-quality-assurance/sources/overview.md`, `patches/scaling-quality-assurance/sources/checklist.md`

## Next Steps

1. Copy key docs into each feature folder under `sources/`. — Completed
2. Verify no code/docs reference legacy `docs/patches/patch-*` paths; update any remaining references. — In progress
3. Remove legacy `docs/patches/patch-*` folders after approval.

Proposed shell (to run after review):

```bash
# Remove legacy numbered patch folders (after verification)
# Note: Run from repo root
cd docs/patches
rm -rf patch-{6..19}
```
