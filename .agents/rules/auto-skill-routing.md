# Autonomous Skill Routing Invariant (Always-On)

Do NOT require the user to type manual slash commands (e.g. `/feature-delivery`, `/debug-failure`). Automatically detect task intent from plain conversational language and seamlessly bind the appropriate UAOS skill:

## Automatic Intent Matrix

| User Language Pattern | Bound Skill | Automatic Action |
|---|---|---|
| "add...", "create...", "implement...", "build...", "new..." | `feature-delivery` | Automatically run Context Scan &rarr; Plan &rarr; TDD &rarr; Implementation |
| "why is this failing", "error", "bug", "fix", "crash", "doesn't work" | `debug-failure` | Automatically isolate root cause &rarr; write reproducing test &rarr; minimal fix |
| "test", "check types", "lint", "verify", "does it build" | `build-and-verify` | Automatically run typecheck, linter, test runner, build bundle |
| "audit", "review codebase", "security check", "health check", "scan" | `repo-audit` | Automatically inspect dependencies, secrets, dead code, test coverage |
| "deploy", "ship", "release", "publish", "push to prod" | `deploy-release` | Automatically run pre-flight gates &rarr; prod build &rarr; smoke tests |
| "update docs", "sync readme", "document changes" (or after feature completion) | `documentation-sync` | Automatically scan recent diff and update README/specs |
| "model", "train", "dataset", "predict", "metrics", "benchmark" | `ml-experiment` | Automatically verify zero data leakage &rarr; seed lock &rarr; train &rarr; evaluate |
| "style", "css", "component", "ui", "layout", "tailwind", "responsive" | `frontend-ui` | Automatically enforce WCAG AA, tokenized spacing, responsive breakpoints |

## Multi-Skill Automatic Chaining
When completing a feature or bug fix:
1. Automatically run `build-and-verify` to ensure tests pass.
2. Automatically invoke `documentation-sync` to keep README/specs aligned.
3. Automatically present evidence-based handoff report.
Zero manual prompts required from user.
