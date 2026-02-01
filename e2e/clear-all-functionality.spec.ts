// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Chord Management', () => {
  test('Clear All Functionality', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Create a complex chord with barre, individual dots, muted strings, and custom string names
    
    // Add individual dots
    await page.locator('.fret-cell[data-fret="1"][data-string="0"]').click();
    await page.locator('[data-string="4"][data-fret="2"]').click(); // Changed to avoid conflict with barre

    // Create a barre
    const barreStartCell = page.locator('[data-string="1"][data-fret="3"]');
    const barreEndCell = page.locator('[data-string="3"][data-fret="3"]');
    await barreStartCell.dragTo(barreEndCell);

    // Mute a string
    await page.getByText('o').nth(3).click();

    // Customize string name
    page.once('dialog', async (dialog) => {
      await dialog.accept('C');
    });
    await page.getByRole('button', { name: '✎' }).nth(2).click();

    // Change chord name
    await page.getByRole('textbox', { name: 'Chord Name:' }).fill('Complex Chord');

    // Verify complex chord is created
    await expect(page.getByText('●', { exact: true })).toHaveCount(2); // Individual dots
    await expect(page.getByText('=', { exact: true })).toHaveCount(3); // Barre symbols
    await expect(page.getByText('x', { exact: true })).toBeVisible();
    await expect(page.locator('.string-marker').nth(2)).toContainText('C');

    // Click the 'Clear All' button
    await page.getByRole('button', { name: 'Clear All' }).click();

    // Verify all dots and barre symbols are removed from the fretboard
    await expect(page.getByText('●', { exact: true })).toHaveCount(0);
    await expect(page.getByText('=', { exact: true })).toHaveCount(0);

    // Verify all string states reset to open ('o') in ASCII output
    await expect(page.locator('#chordDiagram')).toContainText('   o   o   o   o   o   o');

    // Verify all string names reset to default (E A D G B e)
    await expect(page.getByText('E A D G B e')).toBeVisible();

    // Verify the chord name remains unchanged after clearing
    await expect(page.getByRole('textbox', { name: 'Chord Name:' })).toHaveValue('Complex Chord');
  });
});