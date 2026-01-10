# new-feature

Plan and implement a new feature following project patterns.

## Pre-computed Context

```bash
# Recent components
find src/components -name "*.tsx" -type f | head -10

# Available server actions
find src/server -name "*.ts" -type f

# Recent database tables
ls src/drizzle/ | grep -v migrations

# Zod schemas
ls src/zod/contracts/ src/zod/models/ 2>/dev/null
```

## Instructions

### 1. Planning Phase
Ask the user:
- **Feature description**: What should it do?
- **User interaction**: How do users access it?
- **Data requirements**: New database tables/columns needed?
- **Auth requirements**: Who can access this feature?

### 2. Architecture Decisions
Based on the feature, determine:
- Database schema changes (if any)
- New API endpoints needed
- UI components required
- Server actions for business logic

### 3. Implementation Order
Follow this sequence:

**a) Database (if needed)**
- Modify `src/drizzle/schema.ts`
- Create Zod model in `src/zod/models/`
- Run `/db-migrate`

**b) Server Layer**
- Create server actions in `src/server/`
- Add Zod contracts in `src/zod/contracts/`
- Create API routes in `src/app/api/`

**c) UI Layer**
- Create components in `src/components/`
- Use Shadcn/ui components where possible
- Add pages in `src/app/`

**d) Verification**
- Run `/check` for type safety
- Suggest relevant E2E tests
- Verify with user

### 4. Patterns to Follow

**Authentication**: Use Clerk's `auth()` helper
**Forms**: Validate with Zod schemas
**Database**: Drizzle ORM queries in server actions
**Styling**: Tailwind CSS + Shadcn/ui
**Type Safety**: Export types from Zod schemas

### 5. Keep It Simple
- Don't over-engineer
- Follow existing patterns in the codebase
- Make minimal changes to achieve the goal
- Avoid premature abstractions

## After Implementation

Run `/check` and offer to create a PR with `/commit-push-pr`
