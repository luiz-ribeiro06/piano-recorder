console.log("Iniciando WebMidi...");

if (!window.WebMidi) {
    console.error("WebMidi.js não está disponível. Verifique o carregamento do script.");
} else {
    WebMidi.enable()
        .then(() => {
            console.log("WebMidi habilitado.");
            console.log("Entradas detectadas:", WebMidi.inputs);

            if (WebMidi.inputs.length === 0) {
                console.warn("Nenhum dispositivo MIDI encontrado.");
                return;
            }

            const piano = WebMidi.inputs[0];  
            console.log("Conectado ao dispositivo:", piano.name);

            piano.addListener("noteon", (e) => {
                console.log(`Nota ON: ${e.note.name}${e.note.octave} Velocidade: ${e.velocity}`);
            });

            piano.addListener("noteoff", (e) => {
                console.log(`Nota OFF: ${e.note.name}${e.note.octave}`);
            });
        })
        .catch(err => {
            console.error("Erro ao habilitar WebMidi:", err);
        });
}
