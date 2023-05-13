const searchInput = document.querySelector("#searchInput");
const suggestionsList = document.querySelector("#suggestionsList");

searchInput.addEventListener("input", () => {
  getSuggestions();
});

document.addEventListener("click", (event) => {
  if (document.activeElement != searchInput) {
    document.querySelector(".suggestions").style.display = "none";
  }
});

searchInput.addEventListener("focus", () => {
  getSuggestions();
});

async function getSuggestions() {
  const searchTerm = searchInput.value;
  if (!searchTerm || searchTerm == "") {
    suggestionsList.innerHTML = "";
    document.querySelector(".suggestions").style.display = "none";
    return;
  }
  try {
    const response = await fetch(`/intelligence/suggestions?q=${searchTerm}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const suggestions = await response.json();
    suggestionsList.innerHTML = "";
    if (suggestions.length == 0) {
      document.querySelector(".suggestions").style.display = "none";
      return;
    } else {
      document.querySelector(".suggestions").style.display = "block";
    }
    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      li.textContent = suggestion;
      li.addEventListener("click", () => {
        window.location.href = `/search?q=${suggestion}`;
      });
      suggestionsList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}
