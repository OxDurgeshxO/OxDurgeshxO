---
name: feature-delivery
version: 1.0.0
description: End-to-end feature delivery lifecycle from context scan and small-batch planning to verified implementation and handoff.
triggers:
  - "new feature"
  - "implement feature"
  - "add feature"
  - "build capability"
negative_triggers:
  - "fix typo"
  - "triage bug"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Feature Delivery

## Activation and Load Discipline
- **Load when:** Implementing new features or substantial functional expansions.
- **Do NOT load when:** Fixing isolated bugs (use `debug-failure`) or running builds (use `build-and-verify`).

## Purpose
Deliver production-ready features with minimal blast radius, automated tests, synchronized documentation, and evidence-based verification.

## When to use
Use when asked to implement a new feature, add an API endpoint, create an application capability, or extend existing business logic.

## Inputs
- User requirements and acceptance criteria.
- Target workspace code, schemas, and tests.

## Procedure
1. **Context Scan:** Inspect relevant files, existing architecture patterns, test configurations, and dependencies.
2. **Requirement Breakdown:** Restate goal in 1–2 sentences. Identify edge cases and constraints.
3. **Plan:** Author implementation plan specifying target files, test strategy, and rollback path. Obtain approval for non-trivial changes.
4. **Red Stage:** Write failing unit or integration tests specifying expected behavior.
5. **Green Stage:** Implement minimal solution satisfying test assertions with zero unnecessary refactoring.
6. **Verification:** Run typecheck, linter, and full test suite. Confirm exit code 0.
7. **Documentation Sync:** Update relevant README, API types, and docs.
8. **Handoff:** Present structured handoff report with changed files, verification commands, and next steps.

## Verification
- Unit/integration tests pass with exit code 0.
- Typechecker (`tsc` or `mypy`) passes with 0 errors.
- Linter (`eslint` or `ruff`) passes with 0 warnings/errors.

## Safety
- Obtain explicit human approval before installing new third-party dependencies or altering database schemas.
- Prohibit hardcoded secrets or credentials.

## Outputs
- Tested, typed, and formatted feature code.
- Accompanying unit/integration tests.
- Synchronized documentation and concise handoff summary.
