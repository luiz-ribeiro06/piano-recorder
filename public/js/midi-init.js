(function() {
  if (!navigator.requestMIDIAccess) {
    console.error("Web MIDI API não suportado neste navegador.");
    return;
  }

  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

  function onMIDISuccess(midiAccess) {
    console.log("MIDI ligado:", midiAccess);

    for (let input of midiAccess.inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
      console.log("Escutando MIDI em:", input.name);
    }

    midiAccess.onstatechange = (e) => {
      console.log("MIDI state change:", e.port.name, e.port.state);
    };
  }

  function onMIDIFailure(err) {
    console.error("Falha ao acessar MIDI:", err);
  }

  function handleMIDIMessage(event) {
    const [status, note, velocity] = event.data;

    if (status === 0x90 && velocity > 0) {
      console.log("Nota ON:", note, "vel:", velocity);

      document.dispatchEvent(new CustomEvent("midi:note", {
        detail: { type: "noteon", noteNumber: note }
      }));
    }

    if (status === 0x80 || (status === 0x90 && velocity === 0)) {
      console.log("Nota OFF:", note);

      document.dispatchEvent(new CustomEvent("midi:note", {
        detail: { type: "noteoff", noteNumber: note }
      }));
    }
  }
})();
