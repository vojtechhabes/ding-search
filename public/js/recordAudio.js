const isChromium = true;

if (isChromium) {
  try {
    document.querySelector(".voice-search-btn-big").style.display = "flex";
  } catch {
    document.querySelector(".voice-search-btn-small").style.display = "flex";
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

    mediaRecorder.addEventListener("stop", async () => {
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
          "There has been a problem while processing your audio.\nAre you using Chrome browser?"
        );
        window.location.reload();
      }
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  } catch (error) {
    console.error(
      "There has been a problem with your getUserMedia operation:",
      error
    );
  }
}
