// public/js/recorder-buttons.js

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-record");
    const stopBtn = document.getElementById("stop-record");

    if (!startBtn || !stopBtn) return;

    startBtn.addEventListener("click", () => {
      console.log("Iniciando gravação...");
      startBtn.disabled = true;
      stopBtn.disabled = false;
    });

    stopBtn.addEventListener("click", () => {
      console.log("Parando gravação...");
      startBtn.disabled = false;
      stopBtn.disabled = true;
    });
  });
})();
