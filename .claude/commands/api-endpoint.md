# api-endpoint

Scaffold a new API endpoint with proper patterns.

## Pre-computed Context

```bash
# Existing API routes
find src/app/api -name "route.ts" | head -10

# Recent Zod contracts
ls src/zod/contracts/ | tail -5
```

## Instructions

Ask the user:
1. **Endpoint path**: e.g., `/api/cards/review`
2. **HTTP method**: GET, POST, PUT, DELETE
3. **Purpose**: Brief description of what it does

Then create:

### 1. Zod Contract Schema (`src/zod/contracts/`)
- Request schema with input validation
- Response schema with typed output
- Export as `[name]RequestSchema` and `[name]ResponseSchema`

### 2. API Route (`src/app/api/[path]/route.ts`)
```typescript
// Pattern to follow:
// - Import auth from Clerk
// - Validate request with Zod schema
// - Use server actions from src/server/
// - Return typed response
// - Handle errors properly
```

### 3. Server Action (if needed in `src/server/`)
- Database queries using Drizzle
- Business logic
- Return typed data

**Patterns to follow:**
- Check existing endpoints for auth patterns
- Use `NextResponse.json()` for responses
- Validate all inputs with Zod
- Handle errors with proper status codes
- Add types to match your schemas
