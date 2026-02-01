// Test to verify barres don't overwrite existing finger positions
// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Barre and Individual Finger Interaction', () => {
  test('Barres should not overwrite existing finger positions on different frets', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Place an individual finger on string B (index 4) fret 3
    await page.locator('.fret-cell[data-fret="3"][data-string="4"]').click();
    
    // Verify the finger is placed
    await expect(page.getByText('●', { exact: true })).toHaveCount(1);
    
    // Now create a barre on fret 2 from string D (index 2) to string B (index 4) 
    const barreStart = page.locator('[data-string="2"][data-fret="2"]');
    const barreEnd = page.locator('[data-string="4"][data-fret="2"]');
    await barreStart.dragTo(barreEnd);
    
    // Verify we now have both the individual finger and the barre symbols
    await expect(page.getByText('●', { exact: true })).toHaveCount(1); // Individual finger on B string fret 3
    await expect(page.getByText('=', { exact: true })).toHaveCount(3); // Barre on D-G-B strings fret 2
    
    // Verify in ASCII output that both positions are preserved
    await expect(page.locator('#chordDiagram')).toContainText('[●]'); // Individual finger
    await expect(page.locator('#chordDiagram')).toContainText('[═══════'); // Barre notation
  });
});