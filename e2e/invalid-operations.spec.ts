// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Invalid Operations', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Try to create a barre by dragging between different frets
    const invalidStart = page.locator('[data-string="0"][data-fret="2"]');
    const invalidEnd = page.locator('[data-string="5"][data-fret="4"]');
    
    // This should not create a barre across different frets
    await invalidStart.dragTo(invalidEnd);

    // The application should remain stable
    await expect(page.getByText('🎸 ASCII Guitar Chord Generator')).toBeVisible();
    
    // Test with minimal drag distances (should be treated as clicks)
    await page.getByRole('button', { name: 'Clear All' }).click();
    
    // Single click should place/remove dot normally
    await page.getByText('1').click();
    await expect(page.getByText('●', { exact: true })).toBeVisible();
    
    await page.getByText('●', { exact: true }).click();
    await expect(page.getByText('●', { exact: true })).not.toBeVisible();

    // Attempt to drag outside the fretboard boundaries (should have no effect)
    const fretCell = page.locator('[data-string="0"][data-fret="1"]');
    
    // Try to drag from fretboard cell to an area outside the fretboard
    await fretCell.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100); // Move to outside area
    await page.mouse.up();
    
    // Verify no unwanted changes occurred
    await expect(page.getByText('🎸 ASCII Guitar Chord Generator')).toBeVisible();
  });
});