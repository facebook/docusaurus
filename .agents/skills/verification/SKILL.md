---
name: verification
description: Prove how code behaves before reporting it. Use before claiming that a change works, fails or is needed, in particular on another platform than the one you run on (like Windows from macOS).
---

# Verification

Report what you proved, not what you inferred. Don't present the result of reading the code, or of a local simulation, as a fact: run the code. Until you can, report it as unverified.

## Other platforms

You can't prove locally how code behaves on a platform you don't run on. For example, faking `process.platform` on macOS proves nothing about Windows: Node.js and third-party libraries still behave like on macOS.

Prove it on the real platform instead. For Windows, push a commit to a PR (a temporary one if needed, reverted afterwards) and let the Windows CI confirm or refute your assumption. It runs `pnpm test` and builds the website on Windows, but only when the PR changes a file matching its `paths` filter (see `.github/workflows/tests-windows.yml`).
