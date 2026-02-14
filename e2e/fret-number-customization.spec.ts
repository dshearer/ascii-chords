import { test, expect } from '@playwright/test';

test.describe('Fret Number Customization', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('Edit icon appears on hover over first fret number', async ({ page }) => {
        const fretLabel = page.locator('.fret-cell[data-fret="1"][data-string="0"] .fret-label');
        const editIcon = fretLabel.locator('.edit-icon');

        // Edit icon should be hidden initially
        await expect(editIcon).toHaveCSS('opacity', '0');

        // Hover over the fret label (number)
        await fretLabel.hover();

        // Edit icon should be visible
        await expect(editIcon).toHaveCSS('opacity', '1');
    });

    test('Can change starting fret number', async ({ page }) => {
        const firstFretCell = page.locator('.fret-cell[data-fret="1"][data-string="0"]');
        const editIcon = firstFretCell.locator('.fret-label .edit-icon');
        const fretNumber = firstFretCell.locator('.fret-label .fret-number');

        // Initially shows 1
        await expect(fretNumber).toHaveText('1');

        // Hover and click edit icon to open inline input
        await firstFretCell.hover();
        await editIcon.click();

        // An inline input should appear
        const input = firstFretCell.locator('.fret-label .inline-edit');
        await expect(input).toBeVisible();
        await input.fill('5');
        await input.press('Enter');

        // Fret numbers should update
        await expect(fretNumber).toHaveText('5');

        // Second fret should show 6
        const secondFretNumber = page.locator('.fret-cell[data-fret="2"][data-string="0"] .fret-label .fret-number');
        await expect(secondFretNumber).toHaveText('6');

        // Third fret should show 7
        const thirdFretNumber = page.locator('.fret-cell[data-fret="3"][data-string="0"] .fret-label .fret-number');
        await expect(thirdFretNumber).toHaveText('7');
    });

    test('ASCII output shows correct fret indicator when starting fret > 1', async ({ page }) => {
        const firstFretCell = page.locator('.fret-cell[data-fret="1"][data-string="0"]');
        const fretLabel = firstFretCell.locator('.fret-label');
        const editIcon = fretLabel.locator('.edit-icon');

        // Hover and click edit icon to open inline input
        await fretLabel.hover();
        await editIcon.click();

        const input = fretLabel.locator('.inline-edit');
        await input.fill('5');
        await input.press('Enter');

        // Check ASCII output shows fret indicator
        const output = page.locator('#chordDiagram');
        await expect(output).toContainText('(5fr)');
    });

    test('Finger positions are relative to current fret numbers', async ({ page }) => {
        const fretLabel = page.locator('.fret-cell[data-fret="1"][data-string="0"] .fret-label');
        const editIcon = fretLabel.locator('.edit-icon');

        // Change starting fret to 5 via inline input
        await fretLabel.hover();
        await editIcon.click();
        const input = fretLabel.locator('.inline-edit');
        await input.fill('5');
        await input.press('Enter');

        // Now click on the first row (which should be fret 5)
        const firstRowCell = page.locator('.fret-cell[data-fret="1"][data-string="2"]');
        await firstRowCell.click();

        // The ASCII should show a finger at the first fret row (which is fret 5)
        // It should NOT show 'o' for that string at the top
        const output = page.locator('#chordDiagram');
        const text = await output.textContent();

        // The output should show (5fr) indicator
        await expect(output).toContainText('(5fr)');

        // The first fret row in ASCII should have a [●] for string index 2 (D string)
        // And there should NOT be an 'o' indicator for that string at the top
        expect(text).toMatch(/\[●\]/);
    });

    test('Clear all resets fret numbers to 1', async ({ page }) => {
        const firstFretCell = page.locator('.fret-cell[data-fret="1"][data-string="0"]');
        const editIcon = firstFretCell.locator('.fret-label .edit-icon');
        const fretNumber = firstFretCell.locator('.fret-label .fret-number');

        // Change starting fret via inline input
        await firstFretCell.hover();
        await editIcon.click();
        const input = firstFretCell.locator('.fret-label .inline-edit');
        await input.fill('7');
        await input.press('Enter');
        await expect(fretNumber).toHaveText('7');

        // Click clear all
        await page.click('#clearBtn');

        // Fret should reset to 1
        await expect(fretNumber).toHaveText('1');
    });

    test('Only first fret has edit icon', async ({ page }) => {
        // First fret should have edit icon
        const firstFretEditIcon = page.locator('.fret-cell[data-fret="1"][data-string="0"] .fret-label .edit-icon');
        await expect(firstFretEditIcon).toHaveCount(1);

        // Other frets should not have edit icons
        const secondFretEditIcon = page.locator('.fret-cell[data-fret="2"][data-string="0"] .fret-label .edit-icon');
        await expect(secondFretEditIcon).toHaveCount(0);

        const thirdFretEditIcon = page.locator('.fret-cell[data-fret="3"][data-string="0"] .fret-label .edit-icon');
        await expect(thirdFretEditIcon).toHaveCount(0);
    });
});
