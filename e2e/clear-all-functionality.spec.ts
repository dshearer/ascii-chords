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

    // Mute a string (string 5 = e, which has no finger on it)
    await page.locator('.string-marker[data-string="5"]').click();

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
    await expect(page.locator('.string-marker[data-string="5"] .marker-state')).toHaveText('x');
    await expect(page.locator('.string-marker').nth(2)).toContainText('C');

    // Click the 'Clear All' button
    await page.locator('#clearAllBtn').click();

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

  test('Clear Fingers preserves string states, names, chord name, and fret number', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Mute string 0 (E)
    await page.locator('.string-marker[data-string="0"]').click();

    // Customize string name for string 2 via dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept('C');
    });
    await page.getByRole('button', { name: '✎' }).nth(2).click();

    // Change chord name
    await page.getByRole('textbox', { name: 'Chord Name:' }).fill('TestChord');

    // Add dots
    await page.locator('.fret-cell[data-fret="2"][data-string="1"]').click();
    await page.locator('.fret-cell[data-fret="3"][data-string="3"]').click();

    // Create a barre
    const barreStart = page.locator('[data-string="3"][data-fret="4"]');
    const barreEnd = page.locator('[data-string="5"][data-fret="4"]');
    await barreStart.dragTo(barreEnd);

    // Verify dots and barre exist
    await expect(page.getByText('●', { exact: true })).toHaveCount(2);
    await expect(page.getByText('=', { exact: true })).toHaveCount(3);

    // Click 'Clear Fingers'
    await page.locator('#clearFingersBtn').click();

    // Verify dots and barres are removed
    await expect(page.getByText('●', { exact: true })).toHaveCount(0);
    await expect(page.getByText('=', { exact: true })).toHaveCount(0);

    // Verify muted string 0 is still muted
    await expect(page.locator('.string-marker[data-string="0"] .marker-state')).toHaveText('x');

    // Verify custom string name preserved
    await expect(page.locator('.string-marker[data-string="2"]')).toContainText('C');

    // Verify chord name preserved
    await expect(page.getByRole('textbox', { name: 'Chord Name:' })).toHaveValue('TestChord');

    // Verify fret numbers unchanged (still starting at 1)
    await expect(page.locator('.fret-number').first()).toHaveText('1');
  });
});
