// Test to ensure fret labels don't respond to clicks

import { test, expect } from '@playwright/test';

test.describe('Fret Label Behavior', () => {
  test('Fret labels should not respond to clicks', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Verify initial state - no dots present
    await expect(page.getByText('●', { exact: true })).toHaveCount(0);
    
    // Click on various fret labels (1, 2, 3, 4, 5)
    await page.locator('.fret-label').filter({ hasText: '1' }).click();
    await page.locator('.fret-label').filter({ hasText: '2' }).click();
    await page.locator('.fret-label').filter({ hasText: '3' }).click();
    await page.locator('.fret-label').filter({ hasText: '4' }).click();
    await page.locator('.fret-label').filter({ hasText: '5' }).click();
    
    // Verify no dots were placed by clicking labels
    await expect(page.getByText('●', { exact: true })).toHaveCount(0);
    await expect(page.getByText('[●]')).toHaveCount(0);
    
    // Verify the ASCII output still shows empty diagram
    await expect(page.locator('#chordDiagram')).toContainText('│ │ │ │ │ │');
    
    // Now verify that clicking actual fret cells still works
    await page.locator('.fret-cell[data-fret="2"][data-string="1"]').click();
    await expect(page.getByText('●', { exact: true })).toHaveCount(1);
    
    // Verify that clicking fret labels still doesn't interfere
    await page.locator('.fret-label').filter({ hasText: '2' }).click();
    await expect(page.getByText('●', { exact: true })).toHaveCount(1); // Should still be 1, not changed
  });
});