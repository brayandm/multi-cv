import { test, expect } from "@playwright/test";
import { setupCookieConsent } from "./utils/cookies";

test("test", async ({ page }) => {
  await page.goto(process.env.BASE_URL!);

  // Set cookie consent to denied
  setupCookieConsent(page);

  // Check texts on the landing page
  await page.getByText("MultiCV helps you generate").click();
  await expect(page.locator("h1")).toContainText(
    "Create impactful resumes with AI"
  );

  // Check Login and Register Pages
  await page.getByRole("link", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
});
