(function() {
  // Checa se Web MIDI API é suportado
  if (!navigator.requestMIDIAccess) {
    console.error("Web MIDI API não suportado neste navegador.");
    return;
  }

  // Tenta acessar dispositivos MIDI
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

  function onMIDISuccess(midiAccess) {
    console.log("MIDI ligado:", midiAccess);

    // Pra cada entrada MIDI disponível
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

  // Lida com eventos de mensagem MIDI
  function handleMIDIMessage(event) {
    const [status, note, velocity] = event.data;

    // NOTE ON
    if (status === 144 && velocity > 0) {
      console.log("Nota ON:", note, "vel:", velocity);

      document.dispatchEvent(new CustomEvent("midi:note", {
        detail: { type: "noteon", noteNumber: note }
      }));
    }

    // NOTE OFF
    if (status === 128 || (status === 144 && velocity === 0)) {
      console.log("Nota OFF:", note);

      document.dispatchEvent(new CustomEvent("midi:note", {
        detail: { type: "noteoff", noteNumber: note }
      }));
    }
  }
})();
