import { test, expect } from "@playwright/test";
import { setupCookieConsent } from "./utils/cookies";

test("test", async ({ page }) => {
  await page.goto(process.env.BASE_URL! + "/login");
  setupCookieConsent(page);
  await expect(page.getByRole("heading")).toContainText("Login");

  await page.getByRole("textbox", { name: "Email Email*" }).click();
  await page
    .getByRole("textbox", { name: "Email Email*" })
    .fill(process.env.USER_TEST_EMAIL!);
  await page.getByRole("textbox", { name: "Password Password*" }).click();
  await page
    .getByRole("textbox", { name: "Password Password*" })
    .fill(process.env.USER_TEST_PASSWORD!);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByLabel("Simple CV")).toContainText("Generate CV");
  await expect(page.getByRole("strong")).toContainText("Quota Info:");
});
