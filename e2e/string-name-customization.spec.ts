// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('String State Management', () => {
  test('String Name Customization', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Click the edit icon for the D string (3rd string) to open inline input
    await page.getByRole('button', { name: '✎' }).nth(2).click();

    // An inline input should appear pre-filled with 'D'
    const input = page.locator('.string-marker .inline-edit');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('D');

    // Clear and type new name
    await input.fill('C');
    await input.press('Enter');

    // Verify the string name changed from 'D' to 'C'
    await expect(page.locator('.string-marker').nth(2)).toContainText('C');
    await expect(page.getByText('E A C G B e')).toBeVisible();

    // Edit the first string to create Drop D tuning
    await page.getByRole('button', { name: '✎' }).first().click();
    const input2 = page.locator('.string-marker .inline-edit');
    await input2.fill('D');
    await input2.press('Enter');

    // Verify ASCII output reflects the custom tuning
    await expect(page.getByText('D A C G B e')).toBeVisible();
  });
});
