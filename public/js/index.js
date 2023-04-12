function inputFocus() {
  document.getElementById("searchInput").focus();
}
window.onkeydown = inputFocus;
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
const searchInput = document.getElementById("searchInput");
const randomIndex = Math.floor(Math.random() * phrases.length);
searchInput.placeholder = phrases[randomIndex];
