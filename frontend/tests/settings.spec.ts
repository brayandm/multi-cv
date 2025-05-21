import { test, expect } from "@playwright/test";
import { loginSteps } from "./utils/login";

test("test", async ({ page }) => {
  await loginSteps(page);
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading")).toContainText("Settings");
});
