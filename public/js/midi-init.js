(function() {
  if (!navigator.requestMIDIAccess) return;

  navigator.requestMIDIAccess({ sysex: true })
    .then(onMIDISuccess, () => console.error("Falha ao acessar MIDI."));

  function onMIDISuccess(midiAccess) {
    const startListening = () => {
      for (let input of midiAccess.inputs.values()) {
        input.removeEventListener('midimessage', handleMIDIMessage);
        input.addEventListener('midimessage', handleMIDIMessage);
      }
    };

    startListening();
    midiAccess.onstatechange = (e) => {
      if (e.port.state === 'connected') startListening();
    };
  }

  function handleMIDIMessage(event) {
    const [status, note, velocity] = event.data;

    if (status >= 0xf0) return;

    const command = status & 0xf0;

    if (command === 0x90 && velocity > 0) {
      document.dispatchEvent(new CustomEvent("midi:note", {
        detail: { type: "noteon", noteNumber: note }
      }));
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      document.dispatchEvent(new CustomEvent("midi:note", {
        detail: { type: "noteoff", noteNumber: note }
      }));
    }
  }
})();