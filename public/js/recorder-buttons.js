(function () {
  let isRecording = false;
  let startTime = 0;
  let recordingEvents = [];

  document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-record");
    const stopBtn = document.getElementById("stop-record");
    const saveBtn = document.getElementById("save-recording-btn");
    const modal = new bootstrap.Modal(document.getElementById('saveRecordingModal'));

    if (!startBtn || !stopBtn || !saveBtn) return;

    startBtn.addEventListener("click", () => {
      console.log("Recording started...");
      isRecording = true;
      recordingEvents = [];
      startTime = Date.now();
      
      startBtn.disabled = true;
      stopBtn.disabled = false;
      startBtn.innerText = "Recording...";
    });

    stopBtn.addEventListener("click", () => {
      console.log("Recording stopped.");
      isRecording = false;
      
      startBtn.disabled = false;
      stopBtn.disabled = true;
      startBtn.innerText = "Start Recording";

      if (recordingEvents.length > 0) {
        modal.show();
      } else {
        alert("No notes were played.");
      }
    });

    saveBtn.addEventListener("click", async () => {
      const title = document.getElementById("modal-recording-title").value.trim();
      const artist = document.getElementById("modal-recording-artist").value.trim();

      if (!title) {
        alert("Please enter a title for your recording.");
        return;
      }

      await saveRecording(recordingEvents, title, artist);
      modal.hide();
      document.getElementById("modal-recording-title").value = "";
      document.getElementById("modal-recording-artist").value = "";
    });

    document.addEventListener("midi:note", (e) => {
      if (!isRecording) return;

      const { type, noteNumber } = e.detail;
      const relativeTime = Date.now() - startTime;

      recordingEvents.push({
        note: noteNumber,
        type: type,
        time: relativeTime
      });
    });
  });

  async function saveRecording(events, title, artist) {
    try {
      const response = await fetch('/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, events })
      });

      if (response.ok) {
        alert("Performance saved to database!");
      } else {
        alert("Error saving performance.");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  }
})();