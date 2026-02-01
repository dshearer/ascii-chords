// spec: ascii-chord-generator.plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Chord Management', () => {
  test('Chord Name Editing', async ({ page }) => {
    // Navigate to the chord generator application
    await page.goto('http://localhost:3000');

    // Check the default chord name
    await expect(page.getByRole('textbox', { name: 'Chord Name:' })).toHaveValue('Custom');

    // Change the chord name to 'F Major'
    await page.getByRole('textbox', { name: 'Chord Name:' }).fill('F Major');
    await expect(page.locator('#chordDiagram')).toContainText('F Major');
    await expect(page.locator('#chordDiagram')).toContainText('F Major\n=======');

    // Change the name to a shorter name like 'Am'
    await page.getByRole('textbox', { name: 'Chord Name:' }).fill('Am');
    await expect(page.locator('#chordDiagram')).toContainText('Am');
    await expect(page.locator('#chordDiagram')).toContainText('Am\n==');

    // Test with a very long chord name
    await page.getByRole('textbox', { name: 'Chord Name:' }).fill('A Very Long Chord Name With Many Words');
    await expect(page.locator('#chordDiagram')).toContainText('A Very Long Chord Name With Many Words');
    // The underline should match the length
    await expect(page.locator('#chordDiagram')).toContainText('A Very Long Chord Name With Many Words\n======================================');
  });
});