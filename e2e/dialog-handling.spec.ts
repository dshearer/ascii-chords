// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Inline Edit Handling', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Open the inline edit for the D string (3rd string) and press Escape to cancel
    await page.getByRole('button', { name: '✎' }).nth(2).click();
    const input = page.locator('.string-marker .inline-edit');
    await expect(input).toBeVisible();
    await input.press('Escape');

    // Verify string name remains unchanged and no error state occurs
    await expect(page.locator('.string-marker').nth(2)).toContainText('D');
    await expect(page.getByText('E A D G B e')).toBeVisible();

    // Open inline edit, clear the field, and press Enter (empty input)
    await page.getByRole('button', { name: '✎' }).nth(2).click();
    const input2 = page.locator('.string-marker .inline-edit');
    await input2.fill('');
    await input2.press('Enter');

    // Verify string name remains unchanged when empty string submitted
    await expect(page.locator('.string-marker').nth(2)).toContainText('D');

    // Enter very long string names
    await page.getByRole('button', { name: '✎' }).nth(2).click();
    const input3 = page.locator('.string-marker .inline-edit');
    await input3.fill('VeryLongStringNameWithManyCharacters');
    await input3.press('Enter');

    // Verify very long names are accepted and layout remains functional
    await expect(page.locator('.string-marker').nth(2)).toContainText('VeryLongStringNameWithManyCharacters');
    await expect(page.getByText('🎸 ASCII Guitar Chord Generator')).toBeVisible();

    // Test string names with special characters
    await page.getByRole('button', { name: '✎' }).nth(1).click();
    const input4 = page.locator('.string-marker .inline-edit');
    await input4.fill('A♯/B♭');
    await input4.press('Enter');

    // Verify special characters are handled properly in the string marker
    await expect(page.locator('.string-marker').nth(1)).toContainText('A♯/B♭');

    // Test with Unicode characters
    await page.getByRole('button', { name: '✎' }).nth(0).click();
    const input5 = page.locator('.string-marker .inline-edit');
    await input5.fill('🎸');
    await input5.press('Enter');

    // Verify Unicode characters display correctly
    await expect(page.getByText('🎸')).toHaveCount(3); // One in header, one in string name, one in ASCII output
  });
});
