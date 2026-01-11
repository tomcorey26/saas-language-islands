import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should display sign in button on homepage", async ({ page }) => {
    await page.goto("/");

    // Look for sign in link/button
    const signInButton = page.locator('a, button').filter({
      hasText: /sign in|log in/i,
    });

    await expect(signInButton.first()).toBeVisible();
  });

  test("should navigate to sign in page", async ({ page }) => {
    await page.goto("/");

    // Click sign in button
    const signInButton = page
      .locator('a')
      .filter({ hasText: /sign in|log in/i })
      .first();

    if ((await signInButton.count()) > 0) {
      await signInButton.click();

      // Verify we're on sign-in page or Clerk widget appeared
      await expect(page).toHaveURL(/sign-in/);
    }
  });

  test("should navigate to sign up page", async ({ page }) => {
    await page.goto("/");

    // Click sign up button
    const signUpButton = page
      .locator('a')
      .filter({ hasText: /sign up|get started/i })
      .first();

    if ((await signUpButton.count()) > 0) {
      await signUpButton.click();

      // Verify we're on sign-up page
      await expect(page).toHaveURL(/sign-up/);
    }
  });

  test("should protect dashboard routes", async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto("/dashboard");

    // Should redirect to sign-in or show auth required
    await expect(page).toHaveURL(/sign-in|sign-up/);
  });
});
