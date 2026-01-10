# db-migrate

Generate and apply database migrations workflow.

## Pre-computed Context

```bash
# Check for schema changes
git diff src/drizzle/

# Recent migrations
ls -t src/drizzle/migrations/ 2>/dev/null | head -5 || echo "No migrations yet"
```

## Instructions

1. **Review schema changes** shown above
2. **Generate migration**: Run `npm run db:generate`
3. **Review generated SQL**: Show the new migration file contents
4. **Apply migration**:
   - Local: `npm run db:migrate`
   - Production: Ask user if they want to apply to prod with `npm run db:migrate:prod`
5. **Verify**: Run `npm run db:studio` to confirm changes (optional)

**Safety:**
- Always review generated SQL before applying
- Production migrations require explicit user confirmation
- Remind about backing up production data for destructive changes
