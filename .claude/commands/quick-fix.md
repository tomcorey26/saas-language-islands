# quick-fix

Fast bug fix workflow - diagnose, fix, verify.

## Pre-computed Context

```bash
# Recent errors in logs (if any)
git log -10 --oneline

# Git status
git status --short
```

## Instructions

1. **Understand the issue**: Ask user to describe the bug (or reference error message)
2. **Locate the code**: Search for relevant files/functions
3. **Diagnose**: Read the problematic code and identify the root cause
4. **Fix**: Make minimal, targeted changes
5. **Verify**: Run `/check` to ensure no type/lint errors
6. **Test**: If E2E tests cover this area, suggest running them

**Keep it focused:**
- Fix only what's broken
- Don't refactor surrounding code
- Don't add "improvements" beyond the fix
- Verify the fix resolves the specific issue
