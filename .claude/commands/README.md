# Slash Commands

Custom workflow commands for Claude Code. Each command is optimized for speed by pre-computing relevant context inline.

## Available Commands

### `/commit-push-pr`
**One-shot workflow**: Stage changes → commit → push → create PR

Pre-computes: git status, diff, recent commits, branch info
Use when: Ready to create a PR from current changes

### `/check`
**Fast validation**: Runs lint + type-check (no build)

Use when: Quick verification during development
Pattern: Run after every few changes to catch issues early

### `/test`
**E2E testing**: Runs Playwright tests

Pre-computes: Available test files
Use when: Testing payment flows, user journeys, critical paths

### `/db-migrate`
**Database migration workflow**: Generate → review → apply migrations

Pre-computes: Schema changes, recent migrations
Use when: Modified files in `src/drizzle/`
Safety: Always reviews SQL before applying

### `/api-endpoint`
**Scaffold new endpoint**: Creates route + Zod schemas + server action

Pre-computes: Existing routes, recent schemas
Use when: Adding new API endpoints
Pattern: Follows project conventions (Clerk auth, Drizzle, Zod)

### `/quick-fix`
**Bug fix workflow**: Diagnose → fix → verify

Pre-computes: Recent commits, git status
Use when: Addressing specific bugs or issues
Philosophy: Minimal, focused changes

## Creating Custom Commands

1. Create `.claude/commands/your-command.md`
2. Use bash code blocks to pre-compute context:
   ```bash
   # Your pre-computed data here
   git status
   ```
3. Add clear instructions for Claude
4. Commit to git so team can use it

## Tips

- **Speed**: Pre-compute expensive operations (git, find, ls) inline
- **Consistency**: Commands ensure patterns are followed across the team
- **Reusability**: Both you and Claude can invoke these workflows
- **Version Control**: Commands evolve with the project

## Examples

```bash
# Quick check before committing
/check

# Full workflow from changes to PR
/commit-push-pr

# After modifying database schema
/db-migrate

# Scaffold a new endpoint
/api-endpoint
```
