function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.mp3");
      fetch("/intelligence/transcription", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  });
}
