// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('String State Management', () => {
  test('Toggle String States', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Click on the E string marker (leftmost) to toggle state to muted
    await page.getByText('o').nth(3).click();
    await expect(page.getByText('x', { exact: true })).toBeVisible();
    await expect(page.getByText('x o o o o o')).toBeVisible();

    // Click on the same string marker again to toggle back to open
    await page.getByText('x', { exact: true }).click();
    await expect(page.getByText('o o o o o o')).toBeVisible();

    // Place a dot on the A string (2nd string) at fret 2
    await page.locator('.fret-cell[data-fret="2"][data-string="1"]').click();
    await expect(page.getByText('●', { exact: true })).toBeVisible();

    // Verify the string marker no longer shows 'o' (becomes played state - blank)
    // E string has the dot so it should be blank, A-e strings should show 'o'
    await expect(page.getByText('o o o o o')).toBeVisible(); // Only 5 'o' markers now

    // Try to click the A string marker - it should NOT toggle when there's a dot
    const aStringMarker = page.locator('.string-marker').nth(1);
    await aStringMarker.click();
    
    // The A string should still be in played state (no change)
    await expect(page.getByText('x', { exact: true })).not.toBeVisible();
    await expect(page.getByText('o o o o o')).toBeVisible(); // Should remain the same
  });
});