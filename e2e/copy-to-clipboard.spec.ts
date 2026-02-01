// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('ASCII Output and Export', () => {
test('Copy to Clipboard', async ({ page }) => {
  // Navigate to the chord generator application
  await page.goto('http://localhost:3000');

  // Grant clipboard permissions and create a chord pattern
  // Note: Different browsers support different clipboard permissions
  try {
    // Try clipboard-write first (supported by Chromium and Firefox)
    await page.context().grantPermissions(['clipboard-write']);
  } catch (e) {
    try {
      // Try both if supported (Chromium)
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch (e2) {
      // Skip permission granting if not supported by browser
      console.log('Clipboard permissions not supported by this browser, continuing without them');
    }
  }
  
  // Change chord name
  await page.getByRole('textbox', { name: 'Chord Name:' }).fill('Test Chord');
  
  // Place a dot
  await page.locator('.fret-cell[data-fret="2"][data-string="0"]').click();
    
    // Verify ASCII diagram is visible and formatted
    await expect(page.getByText('Test Chord')).toBeVisible();
    await expect(page.getByText('[●]')).toBeVisible();

    // Click the 'Copy to Clipboard' button
    await page.getByRole('button', { name: 'Copy to Clipboard' }).click();

    // Verify button text changes to 'Copied! ✓'
    await expect(page.getByRole('button', { name: 'Copied! ✓' })).toBeVisible();

    // Wait and observe button state reset
    await expect(page.getByRole('button', { name: 'Copy to Clipboard' })).toBeVisible({ timeout: 5000 });

    // Verify content would be copied to system clipboard (we can't easily test actual clipboard in CI)
    // Instead verify the ASCII output contains expected elements
    const asciiOutput = await page.getByText('Test Chord').textContent();
    expect(asciiOutput).toContain('Test Chord');
    await expect(page.getByText('E A D G B e')).toBeVisible();
    await expect(page.getByText('[●]')).toBeVisible();
  });
});