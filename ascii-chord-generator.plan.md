# ASCII Guitar Chord Generator Test Plan

## Application Overview

A comprehensive test plan for the ASCII Guitar Chord Generator web application that allows users to create interactive guitar chord diagrams and export them as ASCII art. The application features an interactive fretboard where users can place individual dots, create barre chords by dragging, toggle string states, customize string names for alternate tunings, and copy the resulting ASCII diagrams.

## Test Scenarios

### 1. Basic Chord Building

**Seed:** `tests/seed.spec.ts`

#### 1.1. Place Individual Dots

**File:** `tests/basic-chord-building/place-individual-dots.spec.ts`

**Steps:**
  1. Navigate to the chord generator application
    - expect: The page loads with title 'ASCII Guitar Chord Generator'
    - expect: The interactive fretboard is visible
    - expect: All string markers show 'o' (open) state
  2. Click on a fret cell (e.g., 3rd fret, 2nd string)
    - expect: A black dot (●) appears in the clicked cell
    - expect: The cell background changes to purple color
    - expect: The ASCII output updates to show [●] at the correct position
  3. Click on the same fret cell again
    - expect: The dot disappears from the cell
    - expect: The cell background returns to white
    - expect: The ASCII output no longer shows the dot at that position
  4. Place dots on multiple different strings and frets
    - expect: Each click places a dot on the respective fret cell
    - expect: All dots are visible simultaneously
    - expect: ASCII output shows all placed dots in correct positions

#### 1.2. Create Barre Chords

**File:** `tests/basic-chord-building/create-barre-chords.spec.ts`

**Steps:**
  1. Click and hold on the first string at fret 1
    - expect: Mouse down event is registered
  2. Drag across to the last string (e) while holding the mouse down
    - expect: Visual feedback shows drag selection across the fret
    - expect: All cells in the drag path highlight in light blue
  3. Release the mouse button
    - expect: A barre is created across all six strings
    - expect: All cells in the barre show blue background with dots
    - expect: ASCII output displays barre notation like [════════════════]
  4. Create a partial barre from string 2 to string 4 on fret 3
    - expect: Only strings 2-4 show the barre
    - expect: ASCII output shows partial barre notation
    - expect: Other strings remain unaffected
  5. Click on any cell that's part of an existing barre
    - expect: The entire barre is removed
    - expect: All cells in the barre return to normal state
    - expect: ASCII output no longer shows barre notation

#### 1.3. Remove Dots and Barres

**File:** `tests/basic-chord-building/remove-dots-and-barres.spec.ts`

**Steps:**
  1. Place a single dot on any fret
    - expect: Individual dot is placed
  2. Click the same cell again
    - expect: The dot is removed
    - expect: Cell returns to normal state
  3. Create a barre across multiple strings
    - expect: Full barre is created
  4. Click any cell within the barre
    - expect: Entire barre is removed
    - expect: All cells in barre return to normal

### 2. String State Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. Toggle String States

**File:** `tests/string-state-management/toggle-string-states.spec.ts`

**Steps:**
  1. Click on the E string marker (leftmost)
    - expect: String marker state changes from 'o' to 'x'
    - expect: ASCII output shows 'x' in the first position of the string labels
  2. Click on the same string marker again
    - expect: String marker state changes from 'x' back to 'o'
    - expect: ASCII output shows 'o' in the first position
  3. Place a dot on the A string (2nd string) at fret 2
    - expect: Dot is placed successfully
    - expect: String marker no longer shows 'o' (becomes played state)
  4. Try to click the A string marker to toggle its state
    - expect: String state does not change
    - expect: Marker remains in played state
    - expect: Click has no effect when finger is placed

#### 2.2. String Name Customization

**File:** `tests/string-state-management/string-name-customization.spec.ts`

**Steps:**
  1. Hover over the D string marker (3rd string)
    - expect: Edit icon (✎) becomes visible
    - expect: Tooltip shows 'Edit string name'
  2. Click the edit icon
    - expect: A prompt dialog appears
    - expect: Dialog message asks for new name for string 3
    - expect: Current name 'D' is pre-filled in the input
  3. Enter 'C' in the prompt and click OK
    - expect: Dialog closes
    - expect: String marker now displays 'C' instead of 'D'
    - expect: ASCII output updates to show 'C' in the string labels
  4. Edit multiple strings to create Drop D tuning (D A D G B E)
    - expect: All string names update correctly
    - expect: ASCII output reflects the custom tuning
    - expect: Names persist when placing/removing dots

### 3. Chord Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. Chord Name Editing

**File:** `tests/chord-management/chord-name-editing.spec.ts`

**Steps:**
  1. Check the default chord name
    - expect: Input field contains 'Custom' by default
  2. Change the chord name to 'F Major'
    - expect: Text appears in the input field
    - expect: ASCII output immediately updates to show 'F Major' as the title
    - expect: Underline of equals signs matches the length of the name
  3. Change the name to a shorter name like 'Am'
    - expect: ASCII output updates the title
    - expect: Underline adjusts to the shorter length
  4. Test with a very long chord name
    - expect: ASCII output shows the long name
    - expect: Layout adjusts appropriately

#### 3.2. Clear All Functionality

**File:** `tests/chord-management/clear-all-functionality.spec.ts`

**Steps:**
  1. Create a chord with barre, individual dots, muted strings, and custom string names
    - expect: Complex chord is created with various elements
  2. Click the 'Clear All' button
    - expect: All dots are removed from the fretboard
    - expect: All barres are removed
    - expect: All string states reset to open ('o')
    - expect: All string names reset to default (E A D G B e)
    - expect: ASCII output shows clean empty diagram
  3. Verify the chord name remains unchanged after clearing
    - expect: Chord name input field is not affected by clear
    - expect: User can preserve their chord naming

### 4. ASCII Output and Export

**Seed:** `tests/seed.spec.ts`

#### 4.1. ASCII Diagram Generation

**File:** `tests/ascii-output-export/ascii-diagram-generation.spec.ts`

**Steps:**
  1. Load the application and observe the default empty diagram
    - expect: ASCII shows chord name with proper underline
    - expect: String labels are aligned: 'E   A   D   G   B   e'
    - expect: Open strings show 'o' markers
    - expect: Empty fretboard shows vertical bars properly
  2. Create a simple chord (e.g., place dots at various positions)
    - expect: Dots appear as [●] in correct fret positions
    - expect: Vertical alignment is maintained
    - expect: Horizontal lines separate frets properly
  3. Create a barre chord with additional individual dots
    - expect: Barre shows as continuous line [════════════════]
    - expect: Combines correctly with individual dots
    - expect: All elements align properly
  4. Test ASCII output with mixed string states
    - expect: Muted strings show 'x' in string state row
    - expect: Open strings show 'o'
    - expect: Played strings show empty space

#### 4.2. Copy to Clipboard

**File:** `tests/ascii-output-export/copy-to-clipboard.spec.ts`

**Steps:**
  1. Grant clipboard permissions in browser
    - expect: Clipboard permissions are available
  2. Create any chord pattern
    - expect: ASCII diagram is visible and formatted
  3. Click the 'Copy to Clipboard' button
    - expect: Button text changes to 'Copied! ✓'
    - expect: Button styling indicates success
    - expect: Content is copied to system clipboard
  4. Wait and observe button state reset
    - expect: Button text reverts to 'Copy to Clipboard' after 2 seconds
    - expect: Normal styling is restored
  5. Paste clipboard content into external text editor and compare
    - expect: Pasted content exactly matches ASCII output
    - expect: All formatting and alignment is preserved
    - expect: Special characters display correctly

### 5. User Experience and Visual Feedback

**Seed:** `tests/seed.spec.ts`

#### 5.1. Visual Feedback

**File:** `tests/user-experience/visual-feedback.spec.ts`

**Steps:**
  1. Hover over any string marker
    - expect: Edit icon (✎) appears on hover
    - expect: Icon has proper positioning and visibility
  2. Hover over fret cells
    - expect: Cell shows hover state with border color change
    - expect: Background color changes slightly
  3. Start dragging to create a barre and observe feedback
    - expect: Light blue highlighting appears during drag
    - expect: Visual feedback guides the drag operation
  4. Create both types of elements and compare styling
    - expect: Purple background for individual dots
    - expect: Blue background for barre cells
    - expect: Clear visual distinction between element types

#### 5.2. Responsive Behavior

**File:** `tests/user-experience/responsive-behavior.spec.ts`

**Steps:**
  1. Test the application at different screen sizes
    - expect: Layout adjusts appropriately
    - expect: All elements remain functional
    - expect: Text remains readable
  2. Test on mobile device or using browser dev tools mobile simulation
    - expect: Touch interactions work correctly
    - expect: Drag gestures function properly
    - expect: All buttons are accessible

### 6. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 6.1. Invalid Operations

**File:** `tests/edge-cases/invalid-operations.spec.ts`

**Steps:**
  1. Try to create a barre by dragging between different frets
    - expect: Operation is ignored
    - expect: No visual changes occur
    - expect: No errors are thrown
  2. Attempt to drag outside the fretboard boundaries
    - expect: Dragging outside the fret area has no effect
    - expect: Application remains stable
  3. Test with minimal drag distances
    - expect: Single click places/removes dot normally
    - expect: Very short drags are treated as clicks

#### 6.2. Dialog Handling

**File:** `tests/edge-cases/dialog-handling.spec.ts`

**Steps:**
  1. Cancel the string name edit dialog
    - expect: Dialog closes without making changes
    - expect: String name remains unchanged
    - expect: No error state occurs
  2. Enter empty string in the name edit dialog
    - expect: String name remains unchanged
    - expect: Dialog closes gracefully
  3. Enter very long string names
    - expect: Very long names are accepted
    - expect: ASCII output handles long names appropriately
    - expect: Layout remains functional
  4. Test string names with special characters
    - expect: Special characters are handled properly
    - expect: Unicode characters display correctly

#### 6.3. Boundary Conditions

**File:** `tests/edge-cases/boundary-conditions.spec.ts`

**Steps:**
  1. Place dots on all six strings
    - expect: All six strings can have dots simultaneously
    - expect: No conflicts occur
    - expect: ASCII output handles full chord
  2. Create barres on multiple frets
    - expect: Multiple barres can coexist
    - expect: Each operates independently
    - expect: Removal works for each barre
  3. Test with extremely long chord names
    - expect: Maximum chord name length is handled
    - expect: Very long names don't break layout
  4. Create the most complex chord possible (barres + dots + muted strings + custom names)
    - expect: All combinations work correctly
    - expect: Complex patterns display properly
