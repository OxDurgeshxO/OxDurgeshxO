---
name: build-and-verify
version: 1.1.0
description: Multi-stack dependency validation, static typechecking, linting, test suite execution, and build artifact verification. Automatically triggers when testing, building, or verifying code quality.
triggers:
  - "build"
  - "test"
  - "run tests"
  - "typecheck"
  - "lint"
  - "verify"
  - "check"
  - "validate"
negative_triggers:
  - "write css"
  - "new prompt"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Build & Verify

## Activation and Load Discipline
- **Load automatically when:** User asks to test, build, lint, typecheck, or verify workspace code quality.
- **Do NOT load when:** Deploying to production environments (use `deploy-release`).

## Purpose
Enforce project quality gates via multi-stage verification: dependencies, types, linter, tests, and build artifacts.

## When to use
Auto-activates during pre-commit checks, verification steps, or when user asks if code builds and passes tests.

## Inputs
- Project workspace roots and manifests (`package.json`, `pyproject.toml`, `Cargo.toml`).

## Procedure
1. **Detect Toolchain:** Identify runtime package manager and commands (e.g. `npm`, `pnpm`, `pip`, `poetry`).
2. **Lint:** Run configured linter (`npm run lint`, `ruff check .`, `flake8`). Report findings.
3. **Typecheck:** Run static type analysis (`tsc --noEmit`, `mypy .`, `pyright`). Ensure 0 type errors.
4. **Test:** Run automated unit and integration tests (`npm test`, `pytest`, `cargo test`). Verify exit code 0.
5. **Build:** Execute production bundle build (`npm run build`, `python -m build`). Verify output artifacts.
6. **Telemetry Report:** Summarize passed checks, duration, and any failed stages.

## Verification
- All verification commands return exit code 0.
- Zero unresolved syntax, type, or lint errors.
- Build directory contains expected distribution artifacts.

## Safety
- Never run commands with unsafe execution flags (`--force`, `--no-verify`).
- Do not modify lockfiles unless explicitly requested.

## Outputs
- Verification scorecard with exact command, exit status, and test counts.
