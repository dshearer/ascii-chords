import { test, expect } from '@playwright/test';

test.describe('Undo/Redo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText('🎸 ASCII Guitar Chord Generator')).toBeVisible();
  });

  test('place a dot, undo removes it, redo restores it', async ({ page }) => {
    // Place a dot on fret 2, string 0
    await page.locator('.fret-cell[data-fret="2"][data-string="0"]').click();
    await expect(page.locator('.fret-cell[data-fret="2"][data-string="0"]')).toHaveClass(/has-dot/);

    // Undo via Ctrl+Z (click body first to ensure focus is not on an input)
    await page.locator('body').click();
    await page.keyboard.press('Control+z');
    await expect(page.locator('.fret-cell[data-fret="2"][data-string="0"]')).not.toHaveClass(/has-dot/);

    // Redo via Ctrl+Shift+Z
    await page.keyboard.press('Control+Shift+z');
    await expect(page.locator('.fret-cell[data-fret="2"][data-string="0"]')).toHaveClass(/has-dot/);
  });

  test('undo button is disabled when there is no history', async ({ page }) => {
    const undoBtn = page.locator('#undoBtn');
    await expect(undoBtn).toBeDisabled();

    // Place a dot to create history
    await page.locator('.fret-cell[data-fret="1"][data-string="0"]').click();
    await expect(undoBtn).toBeEnabled();

    // Undo the action — button should be disabled again
    await undoBtn.click();
    await expect(undoBtn).toBeDisabled();
  });

  test('redo button is disabled after a new action is performed', async ({ page }) => {
    const redoBtn = page.locator('#redoBtn');

    // Place a dot, then undo — redo should be enabled
    await page.locator('.fret-cell[data-fret="1"][data-string="0"]').click();
    await page.locator('#undoBtn').click();
    await expect(redoBtn).toBeEnabled();

    // Perform a new action — redo should be disabled
    await page.locator('.fret-cell[data-fret="3"][data-string="2"]').click();
    await expect(redoBtn).toBeDisabled();
  });

  test('place multiple dots and undo all of them', async ({ page }) => {
    // Place dots on three different strings
    await page.locator('.fret-cell[data-fret="1"][data-string="0"]').click();
    await page.locator('.fret-cell[data-fret="2"][data-string="1"]').click();
    await page.locator('.fret-cell[data-fret="3"][data-string="2"]').click();
    await expect(page.locator('.has-dot')).toHaveCount(3);

    // Undo all three, one at a time
    await page.locator('#undoBtn').click();
    await expect(page.locator('.has-dot')).toHaveCount(2);

    await page.locator('#undoBtn').click();
    await expect(page.locator('.has-dot')).toHaveCount(1);

    await page.locator('#undoBtn').click();
    await expect(page.locator('.has-dot')).toHaveCount(0);

    // Undo button should now be disabled
    await expect(page.locator('#undoBtn')).toBeDisabled();
  });

  test('chord name change is undoable', async ({ page }) => {
    const chordNameInput = page.locator('#chordName');
    await expect(chordNameInput).toHaveValue('Custom');

    // Focus the input (triggers pushUndo), then change the name
    await chordNameInput.focus();
    await chordNameInput.fill('Am7');
    await expect(chordNameInput).toHaveValue('Am7');

    // Click elsewhere to leave the input, then undo
    await page.locator('body').click();
    await page.keyboard.press('Control+z');
    await expect(chordNameInput).toHaveValue('Custom');
  });
});
