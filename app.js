// Chord state
const chordState = {
    strings: ['o', 'o', 'o', 'o', 'o', 'o'], // o = open, x = muted, null = played
    frets: [null, null, null, null, null, null], // fret number for each string
    stringNames: ['E', 'A', 'D', 'G', 'B', 'e'], // customizable string names
    barres: [] // array of { fret, startString, endString }
};

const NUM_FRETS = 5;

// Drag state for barre creation
let dragState = {
    isDragging: false,
    startString: null,
    startFret: null
};

// Helper function to create fret labels with proper event handling
function createFretLabel(fret) {
    const label = document.createElement('div');
    label.className = 'fret-label';
    label.textContent = fret;
    
    // Prevent clicks on labels from bubbling up to the fret cell
    label.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    label.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
    label.addEventListener('mouseup', (e) => {
        e.stopPropagation();
    });
    
    return label;
}

// Initialize the interactive diagram grid
function initializeDiagram() {
    const grid = document.getElementById('diagramGrid');
    grid.innerHTML = '';
    
    for (let fret = 1; fret <= NUM_FRETS; fret++) {
        for (let string = 0; string < 6; string++) {
            const cell = document.createElement('div');
            cell.className = 'fret-cell';
            cell.dataset.fret = fret;
            cell.dataset.string = string;
            
            // Add fret label on first string
            if (string === 0) {
                const label = createFretLabel(fret);
                cell.appendChild(label);
            }
            
            // Mouse handlers for drag-to-create-barre and clicks
            cell.addEventListener('mousedown', (e) => {
                dragState.isDragging = true;
                dragState.startString = string;
                dragState.startFret = fret;
                e.preventDefault();
            });
            
            cell.addEventListener('mouseenter', (e) => {
                if (dragState.isDragging && dragState.startFret === fret) {
                    // Highlight the drag selection
                    highlightDragSelection(dragState.startString, string, fret);
                }
            });
            
            cell.addEventListener('mouseup', (e) => {
                if (dragState.isDragging) {
                    // Check if this is a single click (same position) or a drag
                    if (dragState.startString === string && dragState.startFret === fret) {
                        // Single click
                        handleFretClick(string, fret);
                    } else {
                        // Drag operation
                        handleFretClick(string, fret);
                    }
                    handleDragEnd();
                }
            });
            
            grid.appendChild(cell);
        }
    }
    
    // Global mouseup to finish drag
    document.addEventListener('mouseup', (e) => {
        if (dragState.isDragging) {
            handleDragEnd();
        }
    });
}

// Check if a string/fret position is part of a barre
function getBarreAt(string, fret) {
    return chordState.barres.find(b => 
        b.fret === fret && 
        string >= Math.min(b.startString, b.endString) && 
        string <= Math.max(b.startString, b.endString)
    );
}

// Highlight drag selection (temporary visual feedback)
function highlightDragSelection(startString, endString, fret) {
    const cells = document.querySelectorAll('.fret-cell');
    cells.forEach(cell => {
        cell.classList.remove('drag-highlight');
    });
    
    const minString = Math.min(startString, endString);
    const maxString = Math.max(startString, endString);
    
    cells.forEach(cell => {
        const cellString = parseInt(cell.dataset.string);
        const cellFret = parseInt(cell.dataset.fret);
        
        if (cellFret === fret && cellString >= minString && cellString <= maxString) {
            cell.classList.add('drag-highlight');
        }
    });
}

// Handle end of drag operation
function handleDragEnd() {
    if (!dragState.isDragging) return;
    
    // Remove highlights
    document.querySelectorAll('.fret-cell').forEach(cell => {
        cell.classList.remove('drag-highlight');
    });
    
    // Reset drag state
    dragState.isDragging = false;
    dragState.startString = null;
    dragState.startFret = null;
}

// Handle clicking on a fret cell
function handleFretClick(string, fret) {
    // Check if clicking on a barre - if so, remove it
    const barre = getBarreAt(string, fret);
    if (barre) {
        chordState.barres = chordState.barres.filter(b => b !== barre);
        // Remove individual frets that were part of this barre
        const minString = Math.min(barre.startString, barre.endString);
        const maxString = Math.max(barre.startString, barre.endString);
        for (let s = minString; s <= maxString; s++) {
            if (chordState.frets[s] === fret) {
                chordState.frets[s] = null;
                chordState.strings[s] = 'o';
            }
        }
        updateDiagramDisplay();
        updateASCIIOutput();
        return;
    }
    
    // Check if this was a drag operation
    if (dragState.startString !== null && dragState.startString !== string && dragState.startFret === fret) {
        // Create a barre
        const minString = Math.min(dragState.startString, string);
        const maxString = Math.max(dragState.startString, string);
        
        // Only create barre if it spans at least 2 strings
        if (maxString - minString >= 1) {
            chordState.barres.push({
                fret: fret,
                startString: dragState.startString,
                endString: string
            });
            
            // Set frets for all strings in the barre
            for (let s = minString; s <= maxString; s++) {
                // Only set the barre fret if there's no existing finger position on this string
                if (chordState.frets[s] === null) {
                    chordState.frets[s] = fret;
                    chordState.strings[s] = null;
                }
            }
            
            updateDiagramDisplay();
            updateASCIIOutput();
            return;
        }
    }
    
    // Normal click behavior - toggle dot
    if (chordState.frets[string] === fret) {
        // Remove
        chordState.frets[string] = null;
        chordState.strings[string] = 'o';
    } else {
        // Place a dot at this position
        chordState.frets[string] = fret;
        chordState.strings[string] = null; // Not open or muted
    }
    
    updateDiagramDisplay();
    updateASCIIOutput();
}

// Update the visual display of the interactive diagram
function updateDiagramDisplay() {
    const cells = document.querySelectorAll('.fret-cell');
    
    cells.forEach(cell => {
        const string = parseInt(cell.dataset.string);
        const fret = parseInt(cell.dataset.fret);
        
        cell.classList.remove('has-finger', 'has-dot', 'has-barre', 'barre-start', 'barre-middle', 'barre-end');
        
        // Clear content but preserve fret label if it exists
        const hasLabel = string === 0;
        if (hasLabel) {
            // Keep only the label, remove dot
            const label = cell.querySelector('.fret-label');
            cell.textContent = '';
            if (label) {
                cell.appendChild(label);
            } else {
                const newLabel = createFretLabel(fret);
                cell.appendChild(newLabel);
            }
        } else {
            cell.textContent = '';
        }
        
        // Check if this position is part of a barre
        const barre = getBarreAt(string, fret);
        
        if (barre) {
            cell.classList.add('has-barre');
            const minString = Math.min(barre.startString, barre.endString);
            const maxString = Math.max(barre.startString, barre.endString);
            
            if (string === minString) {
                cell.classList.add('barre-start');
            } else if (string === maxString) {
                cell.classList.add('barre-end');
            } else {
                cell.classList.add('barre-middle');
            }
            
            const barreSymbol = document.createElement('span');
            barreSymbol.textContent = '=';
            cell.appendChild(barreSymbol);
        } else if (chordState.frets[string] === fret) {
            cell.classList.add('has-dot');
            const dot = document.createElement('span');
            dot.textContent = '●';
            cell.appendChild(dot);
        }
    });
    
    // Update string markers
    updateStringMarkers();
}

// Update string marker displays
function updateStringMarkers() {
    const markers = document.querySelectorAll('.string-marker');
    markers.forEach((marker, index) => {
        const state = chordState.strings[index];
        const stateSpan = marker.querySelector('.marker-state');
        const editIcon = marker.querySelector('.edit-icon');
        
        // Update the string name (preserve edit icon)
        marker.childNodes[0].textContent = chordState.stringNames[index];
        
        if (state === 'o') {
            stateSpan.textContent = 'o';
        } else if (state === 'x') {
            stateSpan.textContent = 'x';
        } else {
            stateSpan.textContent = '';
        }
    });
}

// Generate ASCII chord diagram from current state
function generateChordDiagram() {
    const chordName = document.getElementById('chordName').value.trim() || 'Custom';
    
    // Build frets array for ASCII generation
    const frets = chordState.strings.map((state, i) => {
        if (state === 'x') return 'x';
        if (state === 'o' && chordState.frets[i] === null) return '0';
        if (chordState.frets[i] !== null) return chordState.frets[i].toString();
        return '0';
    });
    
    // Find the minimum and maximum fret positions (excluding muted/open strings)
    const fretValues = frets.map(f => {
        if (f === 'x') return -1;
        return parseInt(f);
    });
    
    const playedFrets = fretValues.filter(f => f > 0);
    const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 1;
    const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 5;
    
    // Determine starting fret for display
    let startFret = 1;
    if (minFret > 3) {
        startFret = minFret;
    }
    const endFret = Math.max(startFret + NUM_FRETS - 1, maxFret);
    
    let diagram = '';
    diagram += `\n${chordName}\n`;
    diagram += `${'='.repeat(chordName.length)}\n\n`;
    
    // String labels
    diagram += '   ' + chordState.stringNames.join('   ') + '\n';
    
    // Add muted/open string indicators at top
    let topMarkers = '  ';
    for (let i = 0; i < 6; i++) {
        if (fretValues[i] === -1) {
            topMarkers += ' x  ';
        } else if (fretValues[i] === 0) {
            topMarkers += ' o  ';
        } else {
            topMarkers += '    ';
        }
    }
    diagram += topMarkers + '\n';
    
    // Nut or fret indicator
    if (startFret === 1) {
        diagram += '  ' + '═══════════════════════' + '\n';
    } else {
        diagram += `  ───────────────────────  (${startFret}fr)\n`;
    }
    
    // Draw frets
    for (let fret = startFret; fret <= endFret; fret++) {
        let line = '  ';
        
        // Check if there's a barre on this fret
        const barreOnFret = chordState.barres.find(b => b.fret === fret);
        
        if (barreOnFret) {
            const minString = Math.min(barreOnFret.startString, barreOnFret.endString);
            const maxString = Math.max(barreOnFret.startString, barreOnFret.endString);
            
            for (let string = 0; string < 6; string++) {
                const fretVal = fretValues[string];
                
                if (string < minString || string > maxString) {
                    // Not part of barre
                    if (fretVal === fret) {
                        line += '[●] ';
                    } else {
                        line += ' │  ';
                    }
                } else {
                    // Part of barre
                    if (string === minString) {
                        line += '[══';
                    } else if (string === maxString) {
                        line += '══] ';
                    } else {
                        line += '═══';
                    }
                }
            }
        } else {
            // No barre on this fret
            for (let string = 0; string < 6; string++) {
                const fretVal = fretValues[string];
                
                // Check if this string should have a marker at this fret
                if (fretVal === fret) {
                    line += '[●] ';
                } else {
                    line += ' │  ';
                }
            }
        }
        
        diagram += line + '\n';
        
        if (fret < endFret) {
            diagram += '  ' + '───────────────────────' + '\n';
        }
    }
    
    return diagram;
}

// Update the ASCII output
function updateASCIIOutput() {
    const diagram = generateChordDiagram();
    document.getElementById('chordDiagram').textContent = diagram;
}

// Handle string marker clicks (toggle open/muted/played)
document.querySelectorAll('.string-marker').forEach(marker => {
    marker.addEventListener('click', (e) => {
        // Don't toggle if clicking the edit button
        if (e.target.classList.contains('edit-icon')) {
            return;
        }
        
        const string = parseInt(marker.dataset.string);
        
        // Only toggle if there's no finger placed on this string
        if (chordState.frets[string] === null) {
            if (chordState.strings[string] === 'o') {
                chordState.strings[string] = 'x';
            } else if (chordState.strings[string] === 'x') {
                chordState.strings[string] = 'o';
            }
            
            updateStringMarkers();
            updateASCIIOutput();
        }
    });
});

// Handle edit icon clicks
document.querySelectorAll('.edit-icon').forEach(editBtn => {
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const marker = editBtn.closest('.string-marker');
        const string = parseInt(marker.dataset.string);
        const currentName = chordState.stringNames[string];
        const newName = prompt(`Enter new name for string ${string + 1}:`, currentName);
        
        if (newName !== null && newName.trim() !== '') {
            chordState.stringNames[string] = newName.trim();
            updateStringMarkers();
            updateASCIIOutput();
        }
    });
});

// Clear all button
document.getElementById('clearBtn').addEventListener('click', () => {
    chordState.strings = ['o', 'o', 'o', 'o', 'o', 'o'];
    chordState.frets = [null, null, null, null, null, null];
    chordState.stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
    chordState.barres = [];
    
    updateDiagramDisplay();
    updateASCIIOutput();
});

// Update chord name
document.getElementById('chordName').addEventListener('input', () => {
    updateASCIIOutput();
});

// Copy to clipboard functionality
document.getElementById('copyBtn').addEventListener('click', () => {
    const diagram = document.getElementById('chordDiagram').textContent;
    
    navigator.clipboard.writeText(diagram).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied! ✓';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard');
        console.error('Copy failed:', err);
    });
});

// Initialize on load
initializeDiagram();
updateASCIIOutput();
