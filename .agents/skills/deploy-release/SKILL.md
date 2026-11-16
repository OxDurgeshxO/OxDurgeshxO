---
name: deploy-release
version: 1.0.0
description: Pre-deploy validation, production packaging, zero-downtime deployment execution, post-deploy smoke testing, and rollback.
triggers:
  - "deploy"
  - "release version"
  - "publish release"
  - "production deployment"
negative_triggers:
  - "local test"
  - "dev build"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Deploy & Release

## Activation and Load Discipline
- **Load when:** Preparing releases, deploying applications, publishing packages, or validating production rollouts.
- **Do NOT load when:** Running local tests or dev servers (use `build-and-verify`).

## Purpose
Execute reliable, verifiable production deployments with complete pre-flight checks, smoke testing, and deterministic rollback plans.

## When to use
Use when releasing new software versions to production platforms (Vercel, Cloudflare, AWS, GitHub Releases, npm).

## Inputs
- Candidate commit SHA or release tag.
- Deployment target credentials and environment configuration.

## Procedure
1. **Pre-Deploy Gate:** Verify clean working tree, passing CI tests, and valid semantic version bump.
2. **Environment Validation:** Verify all required production secrets and environment variables are configured.
3. **Build & Package:** Execute clean distribution build with production optimizations enabled.
4. **Deploy Execution:** Trigger deployment via platform CLI or CI release workflow (`gh release create`, `wrangler deploy`, `vercel --prod`).
5. **Post-Deploy Smoke Test:** Probe live HTTP endpoints, verify HTTPS status 200, check health endpoints.
6. **Rollback Preparedness:** Confirm previous stable release artifact is accessible if instant rollback is required.

## Verification
- Target URL responds with HTTP 200 OK.
- Zero error traces in initial deployment logs.
- Release tag matches commit SHA.

## Safety
- Mandatory human approval required before running any remote deploy or release command.
- Never force-push or bypass protected branch policies during release.

## Outputs
- Verified release tag and changelog notes.
- Live deployment URL and health status report.
