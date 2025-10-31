import { test, expect } from '@playwright/test';

test('should redirect to the login page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForURL('**/auth/login');
  expect(page.url()).toContain('/auth/login');
});
