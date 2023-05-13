const isChromium = !!window.chrome;
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  document.querySelector(".voice-search-btn").style.display = "none";
}

async function startRecording() {
  if (!isChromium) {
    alert("For the best experience, please use Chrome browser.");
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    document.querySelector(".voice-search-btn").style.color = "#f93227";

    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      document.querySelector(".voice-search-btn").style.color =
        "var(--primary)";

      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");

      try {
        const response = await fetch("/intelligence/transcription", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.transcription == "") {
          alert("No speech detected. Please try again.");
          return;
        }

        window.location.href = `/search?q=${data.transcription}`;
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        alert(
          "There has been a problem while processing your audio.\n\nAre you using Chrome browser?"
        );
        window.location.reload();
      }
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  } catch (error) {
    if (error.name === "NotAllowedError") {
      alert(
        "Microphone access denied. Please allow access to the microphone and try again."
      );
    } else if (error.name === "NotFoundError") {
      alert(
        "No microphone found. Please make sure you have a microphone connected and try again."
      );
    } else {
      console.error(
        "There has been a problem with your getUserMedia operation:",
        error
      );
    }
  }
}
