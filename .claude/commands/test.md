# test

Runs Playwright E2E tests.

## Pre-computed Context

```bash
# Check if Playwright browsers are installed
npx playwright --version 2>/dev/null || echo "Playwright may need setup"

# List test files
find e2e tests -name "*.spec.ts" -o -name "*.test.ts" 2>/dev/null | head -20
```

## Instructions

1. Run `npm run test:e2e` (or `npm run test`)
2. If tests fail, show the failure summary
3. If tests pass, confirm briefly

**Note:** For Stripe webhook testing, remind user to run `npm run stripe:webhook` if payment tests fail.
