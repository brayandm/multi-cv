import { Page } from "@playwright/test";
import { setupCookieConsent } from "./cookies";

export async function loginSteps(page: Page) {
  await page.goto(`${process.env.BASE_URL}/login`);

  setupCookieConsent(page);

  await page
    .getByRole("textbox", { name: "Email Email*" })
    .fill(process.env.USER_TEST_EMAIL!);
  await page
    .getByRole("textbox", { name: "Password Password*" })
    .fill(process.env.USER_TEST_PASSWORD!);

  await page.getByRole("button", { name: "Login" }).click();
}
