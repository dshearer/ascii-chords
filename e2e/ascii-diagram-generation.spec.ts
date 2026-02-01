// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('ASCII Output and Export', () => {
  test('ASCII Diagram Generation', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Load the application and observe the default empty diagram
    await expect(page.getByText('Custom')).toBeVisible();
    await expect(page.getByText('E A D G B e')).toBeVisible();
    await expect(page.locator('#chordDiagram')).toContainText('   o   o   o   o   o   o');
    await expect(page.getByText('│ │ │ │ │ │')).toBeVisible();

    // Create a simple chord (place dots at various positions)
    await page.locator('.fret-cell[data-fret="1"][data-string="0"]').click();
    await page.locator('.fret-cell[data-fret="2"][data-string="0"]').click(); // This replaces the first dot since they're on the same string
    
    // Verify dots appear as [●] in correct fret positions
    await expect(page.getByText('[●]')).toHaveCount(1); // Only one dot since they're on same string
    await expect(page.getByText('│ │ │ │ │ │')).toBeVisible();

    // Create a barre chord with additional individual dots
    const barreStart = page.locator('[data-string="0"][data-fret="3"]');
    const barreEnd = page.locator('[data-string="5"][data-fret="3"]');
    await barreStart.dragTo(barreEnd);

    // Verify barre shows as continuous line and combines with individual dots
    await expect(page.getByText('[═════════════════════]')).toBeVisible();

    // Test ASCII output with mixed string states
    await page.getByRole('button', { name: 'Clear All' }).click();
    
    // Click on the first string marker (E string) to mute it
    await page.locator('.string-marker[data-string="0"]').click();
    
    // Verify muted strings show 'x' in ASCII output
    await expect(page.locator('#chordDiagram')).toContainText('   x   o   o   o   o   o');
    
    // Place a dot to create played string
    await page.locator('.fret-cell[data-fret="2"][data-string="0"]').click();
    
    // Verify string states in ASCII output - E string is played, others are open
    await expect(page.locator('#chordDiagram')).toContainText('E   A   D   G   B   e');
    
    // Verify played strings show empty space (no 'o' or 'x' marker)  
    // E string should be blank (played), others should show 'o' markers
    await expect(page.locator('#chordDiagram')).toContainText('       o   o   o   o   o'); // E string blank, A,D,G,B,e have 'o'
    
    // Verify the ASCII diagram has the finger position
    await expect(page.locator('#chordDiagram')).toContainText('[●]');
  });
});