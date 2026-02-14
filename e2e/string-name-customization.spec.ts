// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('String State Management', () => {
  test('String Name Customization', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Click the edit icon for the D string (3rd string) and handle dialog
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Enter new name for string 3:');
      await dialog.accept('C');
    });
    await page.getByRole('button', { name: 'Edit string name' }).nth(2).click();

    // Verify the string name changed from 'D' to 'C'
    await expect(page.locator('.string-marker').nth(2)).toContainText('C');
    await expect(page.getByText('E A C G B e')).toBeVisible();

    // Edit the first string to create Drop D tuning
    page.once('dialog', async (dialog) => {
      await dialog.accept('D');
    });
    await page.getByRole('button', { name: 'Edit string name' }).first().click();

    // Verify ASCII output reflects the custom tuning
    await expect(page.getByText('D A C G B e')).toBeVisible();
  });
});