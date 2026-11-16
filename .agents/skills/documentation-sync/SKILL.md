---
name: documentation-sync
version: 1.0.0
description: Automated synchronization of README, API references, architecture specifications, and changelogs following code changes.
triggers:
  - "update docs"
  - "sync documentation"
  - "document changes"
  - "update readme"
negative_triggers:
  - "write feature code"
  - "run linter"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Documentation Sync

## Activation and Load Discipline
- **Load when:** Syncing documentation, updating READMEs, generating API specs, or updating changelogs.
- **Do NOT load when:** Modifying runtime business logic (use `feature-delivery`).

## Purpose
Ensure documentation never drifts from working code by keeping README files, API schemas, and architecture guides synchronized with code changes.

## When to use
Use immediately after completing feature implementations, API modifications, or dependency updates.

## Inputs
- Git diff or list of modified source files.
- Existing documentation (`README.md`, `docs/`, OpenAPI specs).

## Procedure
1. **Diff Inspection:** Inspect recent commit diff to detect altered endpoints, flags, parameters, or behaviors.
2. **Impact Assessment:** Identify every documentation file referencing modified functionality.
3. **Synchronize Content:**
   - Update `README.md` usage examples and badges.
   - Update OpenAPI/Swagger or TypeScript interface docs.
   - Update `CHANGELOG.md` under current unreleased section.
4. **Link Audit:** Verify all hyperlinks and relative file paths are valid (zero broken links).
5. **Code Example Verification:** Test all documented code snippets to ensure they compile and run without error.

## Verification
- Documentation matches actual code behavior.
- Zero broken links in updated documentation.
- Code snippets in docs pass syntax and execution tests.

## Safety
- Do not make speculative claims about unsupported features.
- Never document private internal keys, secrets, or internal test endpoints.

## Outputs
- Updated, synchronized documentation files.
- Link and snippet verification report.
