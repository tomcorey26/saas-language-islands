import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage and display the main heading", async ({
    page,
  }) => {
    // Navigate to the base URL (defined in playwright.config.ts)
    await page.goto("/");

    // Check if the main heading is visible
    // Replace 'Your SaaS App' with the actual text of your main heading if different
    await expect(
      page.locator("h1").filter({ hasText: "Welcome to Language Islands" })
    ).toBeVisible();

    // Example: Check if a specific element exists (e.g., a sign-in button)
    // await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });
});
