# Testing Guide

This document outlines the testing strategy and best practices for the Speech Islands application.

## Overview

Our testing strategy follows industry best practices with a multi-layered approach:

```
┌─────────────────────────────────────┐
│   E2E Tests (Playwright)            │  ← User flows, critical paths
├─────────────────────────────────────┤
│   Integration Tests (Vitest)        │  ← API routes, Server actions
├─────────────────────────────────────┤
│   Unit Tests (Vitest + RTL)         │  ← Components, utilities
└─────────────────────────────────────┘
```

## Tech Stack

- **Unit/Integration Testing**: [Vitest](https://vitest.dev/) - Fast, modern test runner with native ESM support
- **Component Testing**: [React Testing Library](https://testing-library.com/react) - User-centric component testing
- **E2E Testing**: [Playwright](https://playwright.dev/) - Cross-browser end-to-end testing
- **API Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/) - API request interception
- **Coverage**: Vitest Coverage (v8) - Code coverage reporting

## Test Commands

```bash
# Run all unit/integration tests
npm test

# Run tests in watch mode (great for development)
npm run test:watch

# Run tests with coverage report
npm run test:unit

# Open Vitest UI (interactive test viewer)
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run all tests (unit + integration + E2E)
npm run test:all
```

## Directory Structure

```
tests/
├── setup.ts                    # Global test setup
├── utils/
│   └── test-utils.tsx         # Custom render functions, test helpers
├── mocks/
│   ├── handlers.ts            # MSW request handlers
│   └── server.ts              # MSW server setup
├── unit/
│   ├── components/            # Component unit tests
│   └── lib/                   # Utility function tests
├── integration/
│   └── db/                    # Database function tests
└── e2e/
    └── *.spec.ts             # Playwright E2E tests
```

## Writing Tests

### Unit Tests (Components)

Component tests should focus on user-visible behavior, not implementation details.

```typescript
// tests/unit/components/Example.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders with the correct text", () => {
    render(<MyComponent text="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("handles user interactions", async () => {
    const { user } = render(<MyComponent />);
    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);
    expect(screen.getByText("Clicked!")).toBeInTheDocument();
  });
});
```

### Unit Tests (Utilities)

Test pure functions thoroughly with various inputs and edge cases.

```typescript
// tests/unit/lib/example.test.ts
import { describe, it, expect } from "vitest";
import { myUtility } from "@/lib/myUtility";

describe("myUtility", () => {
  it("handles normal cases", () => {
    expect(myUtility("input")).toBe("expected output");
  });

  it("handles edge cases", () => {
    expect(myUtility("")).toBe("");
    expect(myUtility(null)).toBe(null);
  });
});
```

### Integration Tests (Database/API)

Test the integration between different parts of the system.

```typescript
// tests/integration/db/example.test.ts
import { describe, it, expect, vi } from "vitest";
import * as dbFunctions from "@/server/db/example";

vi.mock("@/drizzle/db");

describe("Database Functions", () => {
  it("queries data correctly", async () => {
    const result = await dbFunctions.getData();
    expect(result).toBeDefined();
  });
});
```

### E2E Tests (Playwright)

Test complete user workflows across the application.

```typescript
// tests/e2e/feature.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("completes user workflow", async ({ page }) => {
    await page.goto("/");
    await page.click('text="Get Started"');
    await expect(page).toHaveURL(/sign-up/);
  });
});
```

## Best Practices

### General Principles

1. **Write tests that resemble how users interact with your app**
   - Query by accessible roles, labels, and text content
   - Avoid testing implementation details

2. **Follow the Testing Trophy**
   - Majority of tests should be integration tests
   - Write unit tests for complex utilities and edge cases
   - Write E2E tests for critical user paths

3. **Keep tests isolated**
   - Each test should be independent
   - Use proper setup/teardown
   - Don't rely on test execution order

4. **Use descriptive test names**
   - `it("renders correctly")` ❌
   - `it("displays user's name when logged in")` ✅

### Component Testing

1. **Query Priority** (from most to least preferred):
   ```typescript
   // 1. Accessible queries (best)
   getByRole("button", { name: /submit/i })
   getByLabelText("Email address")
   getByPlaceholderText("Enter email")
   getByText("Welcome")

   // 2. Semantic queries
   getByAltText("Profile picture")
   getByTitle("Close")

   // 3. Test IDs (last resort)
   getByTestId("submit-button")
   ```

2. **Async Testing**
   ```typescript
   // Wait for elements to appear
   await waitFor(() => {
     expect(screen.getByText("Loaded")).toBeInTheDocument();
   });

   // Use findBy for async queries
   const element = await screen.findByText("Async content");
   ```

3. **User Interactions**
   ```typescript
   import { render, screen } from "@/tests/utils/test-utils";
   import userEvent from "@testing-library/user-event";

   it("handles form submission", async () => {
     const user = userEvent.setup();
     render(<MyForm />);

     await user.type(screen.getByLabelText("Email"), "test@example.com");
     await user.click(screen.getByRole("button", { name: /submit/i }));

     expect(screen.getByText("Success!")).toBeInTheDocument();
   });
   ```

### Mocking

1. **External APIs** - Use MSW handlers in `tests/mocks/handlers.ts`
2. **Next.js Features** - Already mocked in `tests/setup.ts`
3. **Database** - Mock Drizzle queries in integration tests
4. **Environment Variables** - Set in `tests/setup.ts`

### Coverage Goals

- **Overall**: 70%+ coverage
- **Critical Paths**: 90%+ coverage (payment, auth, flashcard generation)
- **Utilities**: 80%+ coverage
- **UI Components**: 60%+ coverage (focus on logic, not styling)

## Running Tests in CI

Tests should be run on every pull request:

```yaml
# Example GitHub Actions workflow
- name: Run unit tests
  run: npm run test:unit

- name: Run E2E tests
  run: npm run test:e2e
```

## Common Issues & Solutions

### Issue: "Cannot find module '@/...'"

**Solution**: The path alias is configured in `vitest.config.ts`. Ensure it matches your `tsconfig.json`.

### Issue: "Element not found" in tests

**Solution**:
- Element might render asynchronously - use `findBy` or `waitFor`
- Check if element is hidden - use `queryBy` to verify

### Issue: MSW handlers not working

**Solution**:
- Verify handlers are registered in `tests/mocks/handlers.ts`
- Check that MSW server is started in `tests/setup.ts`
- Ensure request URL matches exactly

### Issue: Playwright tests failing locally

**Solution**:
```bash
# Install browsers
npx playwright install

# Run with headed mode to debug
npx playwright test --headed

# Use Playwright UI
npx playwright test --ui
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing JavaScript Course](https://testingjavascript.com/)

## Contributing

When adding new features:

1. Write tests first (TDD) or alongside implementation
2. Ensure tests pass locally before pushing
3. Maintain or improve code coverage
4. Follow existing test patterns and conventions
5. Add complex scenarios to E2E tests if needed

## Next Steps

- [ ] Add visual regression testing (Playwright + Percy)
- [ ] Implement contract testing for API routes
- [ ] Add performance testing benchmarks
- [ ] Set up mutation testing (Stryker)
