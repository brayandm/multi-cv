import { Page } from "@playwright/test";

export async function setupCookieConsent(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem("cookie_consent", "denied");
  });
}
