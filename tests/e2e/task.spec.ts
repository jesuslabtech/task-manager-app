import { test, expect } from '@playwright/test';

test.describe('Tasks feature', () => {
  test('user can create a task', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('New task').fill('E2E test task');
    await page.getByRole('button', { name: /add/i }).click();

    await expect(page.getByText('E2E test task')).toBeVisible();
  });
});
