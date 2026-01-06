window.isPlayingBack = false;
let keyboard = null;

function noteNameToMidi(noteName) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const name = noteName.slice(0, -1);
    const octave = parseInt(noteName.slice(-1));
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
        document.getElementById(noteName)?.classList.add('active-key');
    
        if (!window.midiProcessing) {
            document.dispatchEvent(new CustomEvent("midi:note", {
                detail: { type: 'noteon', noteNumber: noteNameToMidi(noteName) }
            }));
        }
    };

    keyboard.keyUp = (noteName) => {
        document.getElementById(noteName)?.classList.remove('active-key');
        
        if (!window.midiProcessing) {
            document.dispatchEvent(new CustomEvent("midi:note", {
                detail: { type: 'noteoff', noteNumber: noteNameToMidi(noteName) }
            }));
        }
    };
}

document.addEventListener('DOMContentLoaded', initVirtualKeyboard);

document.addEventListener("midi:note", (e) => {
    if (e.isTrusted === false && !window.recordingHack && !window.isPlayingBack) {
        return;
    }

    if (!keyboard || (window.midiProcessing && !window.isPlayingBack)) return;

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
    const modal = document.getElementById('saveRecordingModal') || document.getElementById('editRecordingModal');
    const isModalOpen = modal && modal.classList.contains('show');
    const isInputFocused = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

    if (isModalOpen || isInputFocused || window.isPlayingBack) {
        event.stopPropagation(); 
        return;
    }
}, { capture: true });