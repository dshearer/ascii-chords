// Test to verify barre chord visual representation
// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Barre Chord Visual Representation', () => {
  test('Verify barre chords show = symbols instead of dots', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Create a barre chord across all strings at fret 1
    const startCell = page.locator('[data-string="0"][data-fret="1"]');
    const endCell = page.locator('[data-string="5"][data-fret="1"]');
    await startCell.dragTo(endCell);

    // Verify that barre cells show '=' symbols instead of '●' dots
    await expect(page.getByText('=', { exact: true })).toHaveCount(6);
    await expect(page.getByText('●', { exact: true })).toHaveCount(0);

    // Now place an individual dot to verify it still shows as a dot
    await page.locator('[data-string="2"][data-fret="3"]').click();
    
    // Should now have 6 equal signs (barre) and 1 dot (individual)
    await expect(page.getByText('=', { exact: true })).toHaveCount(6);
    await expect(page.getByText('●', { exact: true })).toHaveCount(1);
    
    // Clear and test partial barre
    await page.getByRole('button', { name: 'Clear All' }).click();
    
    // Create a partial barre from string 1 to string 3 at fret 2
    const partialStart = page.locator('[data-string="1"][data-fret="2"]');
    const partialEnd = page.locator('[data-string="3"][data-fret="2"]');
    await partialStart.dragTo(partialEnd);
    
    // Should have 3 equal signs for the partial barre
    await expect(page.getByText('=', { exact: true })).toHaveCount(3);
    await expect(page.getByText('●', { exact: true })).toHaveCount(0);
  });
});