// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Basic Chord Building', () => {
  test('Create Barre Chords', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Create a full barre across all six strings at fret 1
    const startCell = page.locator('[data-string="0"][data-fret="1"]');
    const endCell = page.locator('[data-string="5"][data-fret="1"]');
    
    await startCell.dragTo(endCell);

    // Verify a barre is created across all six strings
    await expect(page.getByText('[════════════════]')).toBeVisible();

    // Create a partial barre from string 2 to string 4 on fret 3
    const partialStartCell = page.locator('[data-string="1"][data-fret="3"]');
    const partialEndCell = page.locator('[data-string="3"][data-fret="3"]');
    
    await partialStartCell.dragTo(partialEndCell);

    // Verify partial barre notation appears
    await expect(page.getByText('│ [═══════] │ │')).toBeVisible();

    // Click on any cell that's part of an existing barre to remove it
    await page.getByText('●').first().click();
    await expect(page.getByText('[════════════════]')).not.toBeVisible();
  });
});