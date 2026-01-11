# Testing Quick Start

This is a quick reference for running tests. For comprehensive documentation, see [TESTING.md](./TESTING.md).

## Installation

After pulling the latest changes, install the testing dependencies:

```bash
npm install
```

## Quick Commands

```bash
# Run unit/integration tests (watch mode)
npm test

# Run all tests with coverage
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run everything
npm run test:all

# Open Vitest UI (recommended for development)
npm run test:ui
```

## Project Structure

- `tests/unit/` - Component and utility unit tests
- `tests/integration/` - Database and API integration tests
- `tests/e2e/` - Playwright end-to-end tests
- `tests/setup.ts` - Global test configuration
- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration

## Writing Your First Test

### Component Test Example

```typescript
// tests/unit/components/MyComponent.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders hello message", () => {
    render(<MyComponent name="World" />);
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from "@playwright/test";

test("user can navigate to pricing page", async ({ page }) => {
  await page.goto("/");
  await page.click('text="Pricing"');
  await expect(page).toHaveURL(/pricing/);
});
```

## Test Coverage

View coverage report after running:
```bash
npm run test:unit
```

The coverage report will be available at `coverage/index.html`.

## Debugging Tests

### Vitest UI (Recommended)
```bash
npm run test:ui
```
Opens an interactive browser UI to explore and debug tests.

### Playwright Debug Mode
```bash
npx playwright test --debug
```

### VS Code Debugging

Add this to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Patterns

### Testing Async Components
```typescript
import { waitFor, screen } from "@/tests/utils/test-utils";

it("loads data", async () => {
  render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText("Loaded!")).toBeInTheDocument();
  });
});
```

### Testing User Interactions
```typescript
import userEvent from "@testing-library/user-event";

it("handles click", async () => {
  const user = userEvent.setup();
  render(<Button />);
  await user.click(screen.getByRole("button"));
  expect(screen.getByText("Clicked!")).toBeInTheDocument();
});
```

### Testing Forms
```typescript
it("submits form", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText("Email"), "test@example.com");
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.click(screen.getByRole("button", { name: /sign in/i }));

  expect(screen.getByText("Welcome!")).toBeInTheDocument();
});
```

## Need Help?

- 📖 See [TESTING.md](./TESTING.md) for comprehensive documentation
- 🐛 Common issues? Check the troubleshooting section in TESTING.md
- 💬 Ask the team in the development channel

## CI/CD

Tests automatically run on every pull request via GitHub Actions. Check the "Test" workflow for results.
