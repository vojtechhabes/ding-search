function inputFocus() {
  document.getElementById("searchInput").focus();
}

function validateForm() {
  var x = document.getElementById("searchInput").value;
  if (x == "") {
    return false;
  }
}

const phrases = [
  "What's on your mind?",
  "What are you thinking about?",
  "Find what you're looking for.",
  "Discover something new.",
  "What are you looking for?",
  "What's your question?",
  "What are you curious about?",
  "What are you interested in?",
  "What are you searching for?",
  "What are you looking for?",
];

window.onkeydown = inputFocus;

const searchInput = document.getElementById("searchInput");
const randomIndex = Math.floor(Math.random() * phrases.length);
searchInput.placeholder = phrases[randomIndex];
