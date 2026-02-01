# ASCII Guitar Chord Generator

An interactive web application that generates ASCII art representations of guitar chord diagrams. Build chords visually and export them as text-based diagrams.

## Features

- **Interactive chord builder** - Click on a visual fretboard to place finger positions
- **Barre chord support** - Click and drag across strings to create barres
- **String state control** - Toggle strings between open (o) and muted (x)
- **Custom tunings** - Edit string names for alternate tunings (Drop D, Open G, etc.)
- **Live ASCII preview** - See your chord diagram update in real-time
- **Copy to clipboard** - One-click copy of ASCII diagrams
- **Responsive design** - Works on desktop and mobile

## Usage

### Quick Start

1. Open `index.html` in a web browser (or run `npm start`)
2. Click on fret positions to place dots (●)
3. Click again to remove dots
4. Click string labels (E A D G B e) to toggle open/muted
5. Click and drag across a row to create a barre

### Creating Chords

**Place individual notes:**
- Click any fret cell to place a dot
- Click the same cell again to remove it

**Create barre chords:**
- Click and hold on a fret cell
- Drag across to other strings on the same fret
- Release to create the barre
- Click any part of the barre to remove it

**Toggle string states:**
- Click string labels to toggle: open (o) ↔ muted (x)
- Strings with finger positions cannot be toggled

**Customize tuning:**
- Hover over any string label to reveal the edit icon (✎)
- Click the edit icon to change the string name
- Useful for alternate tunings

**Name your chord:**
- Edit the "Chord Name" field to label your diagram

## Example Output

```
F
=

   E   A   D   G   B   e
                          
  ═══════════════════════
 [══════════════════════] 
  ───────────────────────
   │   │   │   │   │   │  
  ───────────────────────
   │  [●] │  [●] │   │  
  ───────────────────────
   │   │  [●] │   │   │  
  ───────────────────────
   │   │   │   │   │   │  
```

## Development

### Setup

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests with browser visible
npm run test:headed

# Start dev server
npm start
```

### Testing

The project uses Playwright for end-to-end testing, with comprehensive test coverage for:
- Placing and removing dots
- Creating and removing barres
- String state toggling
- String name editing
- Chord name editing
- Clear functionality
- Copy to clipboard
- Complex chord patterns

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Playwright (testing)

## License

MIT
