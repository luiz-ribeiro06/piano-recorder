window.isPlayingBack = false;
let keyboard = null;

function noteNameToMidi(noteName) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    // Ajuste para lidar com notas como C#4 ou Eb4 corretamente
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

    // Evento disparado quando o usuário clica com o mouse ou usa o teclado QWERTY
    keyboard.keyDown = (noteName) => {
        const keyElement = document.getElementById(noteName);
        keyElement?.classList.add('active-key');
    
        // Se NÃO veio de um evento MIDI (ou seja, veio do mouse/teclado PC), avisamos o sistema
        if (!window.midiProcessing) {
            document.dispatchEvent(new CustomEvent("midi:note", {
                detail: { 
                    type: 'noteon', 
                    noteNumber: noteNameToMidi(noteName),
                    origin: 'ui' // Identificador de origem
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

// Ouve tanto o piano real (midi-init.js) quanto o clique do mouse (acima)
document.addEventListener("midi:note", (e) => {
    if (!keyboard) return;

    // Se o evento foi gerado pela UI e não estamos gravando nem em playback, 
    // não precisamos processar visualmente de novo (evita loop infinito)
    if (e.detail.origin === 'ui' && !window.isPlayingBack) return;

    const { type, noteNumber } = e.detail;
    const noteName = midiToNoteName(noteNumber);

    // Ativa a flag para evitar que o keyDown da biblioteca dispare outro evento
    window.midiProcessing = true;
    
    if (type === 'noteon') {
        keyboard.keyDown(noteName);
    } else if (type === 'noteoff') {
        keyboard.keyUp(noteName);
    }
    
    window.midiProcessing = false;
});

// Impede que teclas de atalho interfiram quando houver modais abertos
document.addEventListener('keydown', (event) => {
    const modal = document.querySelector('.modal.show');
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

    if (modal || isInputFocused || window.isPlayingBack) {
        event.stopPropagation(); 
        return;
    }
}, { capture: true });