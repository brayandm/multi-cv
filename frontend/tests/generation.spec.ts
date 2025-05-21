import { test, expect } from "@playwright/test";
import { loginSteps } from "./utils/login";
import { getModal } from "./utils/modal";

test("test", async ({ page }) => {
  await loginSteps(page);

  await expect(page.getByRole("tab", { name: "Simple CV" })).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Based on Role or Position" })
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Based on Job Post" })
  ).toBeVisible();

  await page.getByRole("tab", { name: "Based on Role or Position" }).click();
  await expect(page.locator("body")).toContainText("Role or position");

  await page.getByRole("tab", { name: "Based on Job Post" }).click();
  await expect(page.locator("body")).toContainText("Job post description");

  await expect(page.getByLabel("Based on Job Post")).toContainText(
    "Custom Prompt"
  );

  await page.getByRole("button", { name: "Custom Prompt" }).click();

  const modal = await getModal(page);
  await expect(
    modal.getByPlaceholder("Write a custom prompt to generate your CV.")
  ).toBeVisible();
});
