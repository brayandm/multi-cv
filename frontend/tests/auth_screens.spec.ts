import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.evaluate(() => {
    localStorage.setItem("cookie_consent", "denied");
  });
  await page.getByText("MultiCV helps you generate").click();
  await expect(page.locator("h1")).toContainText(
    "Create impactful resumes with AI"
  );
  await page.getByRole("link", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
});
