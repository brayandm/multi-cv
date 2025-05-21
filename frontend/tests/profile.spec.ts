import { test, expect } from "@playwright/test";
import { loginSteps } from "./utils/login";

test("test", async ({ page }) => {
  await loginSteps(page);

  // Open the profile page
  await page.getByRole("link", { name: "Profile" }).click();

  await expect(page.getByRole("heading")).toContainText("Profile");

  // Basic Info tab
  await expect(page.locator("body")).toContainText("First name");

  // Professional Links tab
  await page.getByRole("tab", { name: "Links" }).click();
  await expect(page.locator("body")).toContainText("Select a link");

  // Experience tab
  await page.getByRole("tab", { name: "Experience" }).click();
  await expect(page.locator("body")).toContainText("Company");

  // Education tab
  await page.getByRole("tab", { name: "Education" }).click();
  await expect(page.locator("body")).toContainText("Add Education");

  // Projects tab
  await page.getByRole("tab", { name: "Projects" }).click();
  await expect(page.locator("body")).toContainText("Add Project");

  // Certifications tab
  await page.getByRole("tab", { name: "Certifications" }).click();
  await expect(page.locator("body")).toContainText("Add Certification");

  // Languages tab
  await page.getByRole("tab", { name: "Languages" }).click();
  await expect(page.locator("body")).toContainText("Language");

  // Skills tab
  await page.getByRole("tab", { name: "Skills" }).click();
  await expect(page.locator("body")).toContainText("Skill");
});
