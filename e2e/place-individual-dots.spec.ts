// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Basic Chord Building', () => {
  test('Place Individual Dots', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Verify the page loads with title 'ASCII Guitar Chord Generator'
    await expect(page.getByText('🎸 ASCII Guitar Chord Generator')).toBeVisible();

    // Verify the interactive fretboard is visible
    await expect(page.getByText('Build Your Chord')).toBeVisible();

    // Verify all string markers show 'o' (open) state in ASCII output
    await expect(page.locator('#chordDiagram')).toContainText('   o   o   o   o   o   o');

    // Click on a fret cell (3rd fret, 2nd string - string index 1)
    await page.locator('.fret-cell[data-fret="3"][data-string="1"]').click();
    await expect(page.getByText('●', { exact: true })).toBeVisible();
    await expect(page.getByText('[●]')).toBeVisible();

    // Click on the same fret cell again to remove the dot
    await page.locator('.fret-cell[data-fret="3"][data-string="1"]').click();
    await expect(page.getByText('●', { exact: true })).not.toBeVisible();

    // Place dots on different frets of the same string (they replace each other)
    await page.locator('.fret-cell[data-fret="1"][data-string="1"]').click();
    await expect(page.getByText('[●]')).toBeVisible();

    await page.locator('.fret-cell[data-fret="2"][data-string="1"]').click();
    // Only one dot should exist since they're on the same string
    await expect(page.getByText('●', { exact: true })).toHaveCount(1);
    await expect(page.getByText('[●]')).toBeVisible();

    // Test clicking on different strings to ensure multiple dots can exist
    await page.locator('.fret-cell[data-fret="3"][data-string="2"]').click();
    await page.locator('.fret-cell[data-fret="4"][data-string="3"]').click();
    // Should now have 3 dots total (fret 2 string 1, fret 3 string 2, fret 4 string 3)
    await expect(page.getByText('●', { exact: true })).toHaveCount(3);
  });
});