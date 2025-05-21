import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(process.env.BASE_URL! + "/login");
  await page.evaluate(() => {
    localStorage.setItem("cookie_consent", "denied");
  });
  await expect(page.getByRole("heading")).toContainText("Login");

  await page.getByRole("textbox", { name: "Email Email*" }).click();
  await page
    .getByRole("textbox", { name: "Email Email*" })
    .fill("test@multicv.space");
  await page.getByRole("textbox", { name: "Password Password*" }).click();
  await page
    .getByRole("textbox", { name: "Password Password*" })
    .fill("BZqZXL3TjghX7ZA");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByLabel("Simple CV")).toContainText("Generate CV");
  await expect(page.getByRole("strong")).toContainText("Quota Info:");
});
