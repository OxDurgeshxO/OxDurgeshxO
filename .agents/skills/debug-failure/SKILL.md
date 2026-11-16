---
name: debug-failure
version: 1.1.0
description: Defect isolation, root-cause diagnosis, minimal surgical fixing, regression test authoring, and verification. Automatically triggers on errors, bugs, or failing code.
triggers:
  - "debug"
  - "fix"
  - "error"
  - "bug"
  - "failing"
  - "broken"
  - "crash"
  - "issue"
  - "doesn't work"
  - "stack trace"
negative_triggers:
  - "new feature"
  - "deploy release"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Debug Failure

## Activation and Load Discipline
- **Load automatically when:** User mentions errors, bugs, crashes, broken functionality, or failing tests.
- **Do NOT load when:** Writing new features from scratch (use `feature-delivery`).

## Purpose
Isolate root cause of defect, apply minimal targeted fix, prevent recurrence with regression tests, and verify complete resolution.

## When to use
Auto-activates on any error message, failing test, bug report, or crash without manual slash commands.

## Inputs
- Error message, stack trace, or reproduction steps.
- Failing test output or environment logs.

## Procedure
1. **Reproduce:** Execute minimal reproduction command or write reproducing test case that fails deterministically.
2. **Isolate:** Trace call stack backwards to identify exact module, function, or state mutation causing defect.
3. **Root-Cause Analysis:** Verify underlying reason for failure (e.g. race condition, type mismatch, off-by-one, unhandled null/undefined).
4. **Minimal Fix:** Apply smallest sufficient fix. Do not refactor adjacent working code.
5. **Regression Test:** Commit test that catches defect if re-introduced.
6. **Verify:** Run full test suite to guarantee 0 regressions across entire codebase.

## Verification
- Reproducing test passes cleanly with exit code 0.
- All previously passing tests continue to pass.
- Typechecker and linter verify 0 errors.

## Safety
- Never suppress errors with catch-all blocks or silent type assertions (`any`, `as never`).
- Do not make speculative fixes without understanding root cause.

## Outputs
- Root cause diagnosis report.
- Minimal code fix.
- Automated regression test suite addition.
