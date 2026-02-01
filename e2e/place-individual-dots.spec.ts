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

    // Verify all string markers show 'o' (open) state
    await expect(page.getByText('o o o o o o')).toBeVisible();

    // Click on a fret cell (e.g., 3rd fret, 2nd string)
    await page.getByText('3').click();
    await expect(page.getByText('●', { exact: true })).toBeVisible();
    await expect(page.getByText('[●]')).toBeVisible();

    // Click on the same fret cell again
    await page.getByText('●', { exact: true }).click();
    await expect(page.getByText('●', { exact: true })).not.toBeVisible();

    // Place dots on different frets (they replace each other on the same string)
    await page.getByText('1').click();
    await expect(page.getByText('[●]')).toBeVisible();

    await page.getByText('2').click();
    // Only one dot should exist since they're on the same string
    await expect(page.getByText('●', { exact: true })).toHaveCount(1);
    await expect(page.getByText('[●]')).toBeVisible();
  });
});