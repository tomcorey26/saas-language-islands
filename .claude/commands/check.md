# check

Quick validation: runs linter and type checker (no build).

## Instructions

Run these checks in parallel:

```bash
npm run lint
npm run type-check
```

Report any errors or warnings concisely. If all checks pass, confirm with a simple ✓ message.

**Do not** run `npm run build` unless explicitly requested - this is a fast check for the inner loop.
