window.isPlayingBack = false;
let keyboard = null;

function noteNameToMidi(noteName) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = parseInt(noteName.slice(-1));
    const name = noteName.slice(0, -1);
    return (octave + 1) * 12 + names.indexOf(name);
}

function midiToNoteName(midiNumber) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return names[midiNumber % 12] + (Math.floor(midiNumber / 12) - 1);
}

function initVirtualKeyboard() {
    keyboard = new QwertyHancock({
        id: 'piano-wrap',
        width: 600,
        height: 125,
        octaves: 2,
        startNote: 'A3',
        whiteNotesColour: 'white',
        blackNotesColour: 'black'
    });

    keyboard.keyDown = (noteName) => {
        const keyElement = document.getElementById(noteName);
        keyElement?.classList.add('active-key');
    
        if (!window.midiProcessing) {
            document.dispatchEvent(new CustomEvent("midi:note", {
                detail: { 
                    type: 'noteon', 
                    noteNumber: noteNameToMidi(noteName),
                    origin: 'ui'
                }
            }));
        }
    };

    keyboard.keyUp = (noteName) => {
        const keyElement = document.getElementById(noteName);
        keyElement?.classList.remove('active-key');
        
        if (!window.midiProcessing) {
            document.dispatchEvent(new CustomEvent("midi:note", {
                detail: { 
                    type: 'noteoff', 
                    noteNumber: noteNameToMidi(noteName),
                    origin: 'ui'
                }
            }));
        }
    };
}

document.addEventListener('DOMContentLoaded', initVirtualKeyboard);

document.addEventListener("midi:note", (e) => {
    if (!keyboard) return;

    if (e.detail.origin === 'ui' && !window.isPlayingBack) return;

    const { type, noteNumber } = e.detail;
    const noteName = midiToNoteName(noteNumber);

    window.midiProcessing = true;
    
    if (type === 'noteon') {
        keyboard.keyDown(noteName);
    } else if (type === 'noteoff') {
        keyboard.keyUp(noteName);
    }
    
    window.midiProcessing = false;
});

document.addEventListener('keydown', (event) => {
    const modal = document.querySelector('.modal.show');
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

    if (modal || isInputFocused || window.isPlayingBack) {
        event.stopPropagation(); 
        return;
    }
}, { capture: true });