const isChromium = !!window.chrome;

if (isChromium) {
  try {
    document.querySelector(".voice-search-btn-big").style.display = "flex";
  } catch {
    document.querySelector(".voice-search-btn-small").style.display = "flex";
  }
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    try {
      document.querySelector(".voice-search-btn-big").style.backgroundColor =
        "#f93227";
    } catch {
      document.querySelector(".voice-search-btn-small").style.backgroundColor =
        "#f93227";
      document.querySelector(".voice-search-btn-small").style.color =
        "var(--background)";
    }

    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      try {
        document.querySelector(".voice-search-btn-big").style.backgroundColor =
          "var(--primary)";
      } catch {
        document.querySelector(
          ".voice-search-btn-small"
        ).style.backgroundColor = "var(--background)";
        document.querySelector(".voice-search-btn-small").style.color =
          "var(--primary)";
      }
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      fetch("/intelligence/transcription", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.transcription == "") {
            alert("No speech detected. Please try again.");
            return;
          }
          window.location.href = `/search?q=${data.transcription}`;
        });
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  });
}
