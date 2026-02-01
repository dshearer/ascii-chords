# ASCII Guitar Chord Generator

A simple web application that generates ASCII art representations of guitar chord diagrams.

## Features

- 12 preset common guitar chords (C, D, E, F, G, A, Am, Em, Dm, Cmaj7, G7, Dsus4)
- Custom chord creation
- Finger position indicators
- Copy to clipboard functionality
- Responsive design

## Usage

1. Open `index.html` in a web browser
2. Click any preset chord button to see its ASCII diagram
3. Or create a custom chord by entering:
   - Chord name
   - Fret numbers (0-9 or 'x' for muted)
   - Optional finger positions (1-4 or 'x')

## Chord Notation

- `x` or `-`: Muted/not played string
- `0`: Open string
- `1-9`: Fret number
- Strings are ordered: E A D G B E (low to high)

## Example

```
C
=

  E   A   D   G   B   e
  x   o       o       o
  ═══════════════
  │  [3] │  │  │  │ 
  ───────────────
  │  │  [2] │  │  │ 
  ───────────────
  │  │  │  │  [1] │ 
  ───────────────
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
