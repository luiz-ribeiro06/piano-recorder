// public/js/piano-visual.js

let keyboard = null;

// Função para iniciar o teclado
function initVirtualKeyboard() {
  var keyboard = new QwertyHancock({
                 id: 'piano-wrap',
                 width: 600,
                 height: 125,
                 octaves: 2,
                 startNote: 'A3',
                 whiteNotesColour: 'white',
                 blackNotesColour: 'black',
                 hoverColour: '#007bff',
            });

  console.log("Teclado virtual pronto.");
}

// Função pra converter MIDI number em nome de nota  
function midiToNoteName(midiNumber) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const name  = names[midiNumber % 12];
  const octave= Math.floor(midiNumber / 12) - 1;
  return name + octave;
}

// Espera o DOM carregar e inicializa teclado
document.addEventListener('DOMContentLoaded', () => {
  initVirtualKeyboard();
});

// Ouve eventos MIDI vindos do midi-init.js
document.addEventListener("midi:note", (e) => {
  if (!keyboard) return;

  const { type, noteNumber } = e.detail;
  const noteName = midiToNoteName(noteNumber);

  if (type === 'noteon') {
    keyboard.keyDown(noteName);
  } else if (type === 'noteoff') {
    keyboard.keyUp(noteName);
  }
});
