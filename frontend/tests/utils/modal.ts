import { Page } from "@playwright/test";

export async function getModal(page: Page) {
  return await page.locator(
    "dialog, [role='dialog'], .modal, .chakra-modal__content"
  );
}
