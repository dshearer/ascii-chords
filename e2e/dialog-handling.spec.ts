// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Dialog Handling', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Cancel the string name edit dialog
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Enter new name for string 3:');
      await dialog.dismiss(); // Cancel the dialog
    });
    await page.getByRole('button', { name: 'Edit string name' }).nth(2).click();

    // Verify string name remains unchanged and no error state occurs
    await expect(page.locator('.string-marker').nth(2)).toContainText('D');
    await expect(page.getByText('E A D G B e')).toBeVisible();

    // Enter empty string in the name edit dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept(''); // Enter empty string
    });
    await page.getByRole('button', { name: 'Edit string name' }).nth(2).click();

    // Verify string name remains unchanged and dialog closes gracefully
    await expect(page.locator('.string-marker').nth(2)).toContainText('D');

    // Enter very long string names
    page.once('dialog', async (dialog) => {
      await dialog.accept('VeryLongStringNameWithManyCharacters'); 
    });
    await page.getByRole('button', { name: 'Edit string name' }).nth(2).click();

    // Verify very long names are accepted and layout remains functional
    await expect(page.locator('.string-marker').nth(2)).toContainText('VeryLongStringNameWithManyCharacters');
    await expect(page.getByText('🎸 ASCII Guitar Chord Generator')).toBeVisible();

    // Test string names with special characters
    page.once('dialog', async (dialog) => {
      await dialog.accept('A♯/B♭'); // Special music characters
    });
    await page.getByRole('button', { name: 'Edit string name' }).nth(1).click();

    // Verify special characters are handled properly in the string marker
    await expect(page.locator('.string-marker').nth(1)).toContainText('A♯/B♭');
    
    // Test with Unicode characters
    page.once('dialog', async (dialog) => {
      await dialog.accept('🎸'); // Unicode emoji
    });
    await page.getByRole('button', { name: 'Edit string name' }).nth(0).click();

    // Verify Unicode characters display correctly
    await expect(page.getByText('🎸')).toHaveCount(3); // One in header, one in string name, one in ASCII output
  });
});