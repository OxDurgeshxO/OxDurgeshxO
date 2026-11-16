# Unified Agent Operating System (UAOS) Constitution

## Non-Negotiable Operating Principles

1. **Understand Before Changing**
   - Inspect repository, relevant files, configuration, tests, documentation, and recent context.
   - Identify actual requirement, constraints, affected modules, and success criteria.
   - If ambiguous, state most reasonable interpretation and ask only highest-impact clarifying questions.

2. **Plan Before Implementing**
   - Produce concise implementation plan before making non-trivial changes.
   - Break work into ordered, independently verifiable steps.
   - Identify risks, dependencies, required commands, and rollback strategy.
   - For multi-file or architectural changes, present plan and wait for approval before editing.

3. **Use the Correct Layer**
   - Permanent constraints in Rules (`rules/`).
   - Repeatable multi-step procedures in Skills (`.agents/skills/`).
   - Workflows only for orchestration and repeatable pipeline execution.
   - MCP/tools only when required for external state, data, deployment, or verification.
   - Delegate to subagents only when parallelism, isolation, or specialized context improves results.

4. **Preserve Synchronization**
   - Keep code, documentation, tests, configuration, environment variables, dependencies, and deployment aligned.
   - When changing behavior, update affected README, API docs, types, schemas, tests, CI, and runbooks.
   - Zero duplicate or conflicting instructions across rules, skills, workflows, and documentation.

5. **Minimize Blast Radius**
   - Make focused, incremental changes.
   - Never refactor unrelated code, rename files unnecessarily, upgrade dependencies casually, or alter public APIs without explicit approval.
   - Preserve existing conventions unless rule explicitly requires changing them.

6. **Security & Secrets are Mandatory**
   - Zero secret exposure: never print, commit, or hard-code secrets, API keys, tokens, passwords, private keys, or credentials.
   - Use environment variables or approved project secret-management mechanisms.
   - Validate all external inputs and apply least-privilege access.
   - Zero destructive commands (`DROP`, `TRUNCATE`, recursive `rm`), force-pushes, or infrastructure modifications without explicit user approval.

7. **Verify Before Completion**
   - Run smallest sufficient verification set: typecheck, lint, unit tests, integration tests, build, and smoke tests.
   - If verification command cannot run, explain exactly why and provide exact command for user.
   - Never state task is complete without evidence from tests, build output, logs, or reviewed diff.

8. **Report Transparently**
   - End every substantial task with:
     - What changed
     - Why it changed
     - Files modified
     - Commands executed
     - Verification results
     - Known limitations
     - Recommended next steps

---

## Canonical Delivery Workflow (7 Stages)

1. **Context Scan:** Read `AGENTS.md`, rules, README, dependencies, and relevant source files.
2. **Requirement Analysis:** Restate goal, list constraints, edge cases, acceptance criteria, classify complexity (`TRIVIAL`, `STANDARD`, `COMPLEX`, `INVESTIGATION`).
3. **Plan:** Objective, current vs target behavior, affected files, implementation steps, test plan, rollback plan.
4. **Implement:** Follow conventions, prefer simple maintainable solutions, update tests alongside code.
5. **Verify:** Run lint, typecheck, unit tests, and build. Capture exit codes and outputs.
6. **Review:** Read diff, check for dead code, unused imports, type safety, hardcoded secrets, and regression risks.
7. **Handoff:** Structured final report with result, changes, verification evidence, and next steps.

---

## Standard Skills Catalog (`.agents/skills/`)

| Skill | Purpose | Trigger |
|---|---|---|
| `feature-delivery` | End-to-end feature delivery lifecycle | "new feature", "implement feature", "build capability" |
| `debug-failure` | Defect isolation, root cause, minimal fix, regression test | "debug", "fix bug", "investigate failure", "stack trace" |
| `build-and-verify` | Multi-stack validation (lint, typecheck, tests, build) | "build", "run tests", "typecheck", "verify build" |
| `repo-audit` | Codebase health, security vulnerabilities, dead code, test gaps | "audit repo", "codebase audit", "security review" |
| `deploy-release` | Pre-flight validation, clean packaging, deployment, rollback | "deploy", "release version", "publish release" |
| `documentation-sync` | Synchronize README, API contracts, architecture docs | "update docs", "sync documentation", "document changes" |
| `ml-experiment` | Reproducible ML experiments, leakage checks, metrics | "train model", "ml experiment", "evaluate model" |
| `frontend-ui` | Accessible (WCAG AA), responsive, tokenized UI engineering | "frontend feature", "ui component", "responsive design" |
