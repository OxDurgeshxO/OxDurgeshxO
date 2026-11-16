---
name: repo-audit
version: 1.0.0
description: Codebase health check, architecture drift analysis, dead code elimination, dependency risks, and secret exposure scan.
triggers:
  - "audit repo"
  - "codebase audit"
  - "security review"
  - "health check"
  - "dependency audit"
negative_triggers:
  - "fix typo"
  - "run single test"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Repo Audit

## Activation and Load Discipline
- **Load when:** Auditing repositories, evaluating architecture, scanning for vulnerabilities, or reviewing codebase health.
- **Do NOT load when:** Actively building a feature (use `feature-delivery`).

## Purpose
Produce comprehensive health assessment of codebase covering architecture, security, code quality, dependency health, and test coverage.

## When to use
Use during codebase onboarding, pre-release security verification, or technical debt triage.

## Inputs
- Repository root path and git history.

## Procedure
1. **Inventory & Stack Fingerprinting:** Catalog language, framework, dependencies, and file count.
2. **Secret & Credential Scan:** Scan repository for exposed API keys, tokens, `.env` files, or private keys.
3. **Dependency Risk Check:** Run package audit (`npm audit`, `pip-audit`) to detect known CVEs.
4. **Dead Code & Drift:** Check for unreferenced exports, obsolete scripts, and undocumented configurations.
5. **Test Coverage Evaluation:** Inspect test suite completeness, missing edge cases, and CI workflows.
6. **Report Generation:** Summarize findings prioritized by severity (Critical, High, Medium, Low).

## Verification
- Audit report completed across all 5 dimensions.
- Zero unredacted secrets printed in outputs.

## Safety
- Read-only analysis. Never delete unreferenced files without explicit human confirmation.
- Redact all discovered secret values (report identifier keys only).

## Outputs
- Structured audit report with actionable remediation checklist.
