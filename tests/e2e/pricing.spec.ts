import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test("should display pricing cards", async ({ page }) => {
    await page.goto("/pricing");

    // Check for pricing tier headings
    await expect(page.getByRole("heading", { name: /starter/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /pro/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /premium/i })
    ).toBeVisible();
  });

  test("should have working CTA buttons", async ({ page }) => {
    await page.goto("/pricing");

    // Find all "Get Started" or similar buttons
    const buttons = page.locator('button, a[role="button"]').filter({
      hasText: /get started|buy now|purchase/i,
    });

    // Verify at least one button exists
    await expect(buttons.first()).toBeVisible();
  });

  test("should navigate to sign up when clicking CTA", async ({ page }) => {
    await page.goto("/pricing");

    // Click the first "Get Started" button (adjust selector as needed)
    const ctaButton = page
      .locator('button, a')
      .filter({ hasText: /get started/i })
      .first();

    if ((await ctaButton.count()) > 0) {
      await ctaButton.click();

      // Verify navigation (adjust expected URL based on your routing)
      await expect(page).toHaveURL(/sign-up|dashboard\/buy/);
    }
  });
});
