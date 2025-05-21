import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://multicv.space/');
  await page.getByText('Create impactful resumes with AI MultiCV helps you generate personalized').click();
  await expect(page.getByRole('paragraph')).toContainText('We use cookies to improve your experience, help us identify bugs and issues, and gather usage data for analysis. For more information, see our Privacy Policy and Cookies Policy. You can choose whether to allow this.');
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(page.locator('h1')).toContainText('Create impactful resumes with AI');
});