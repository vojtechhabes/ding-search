const searchInput = document.querySelector("#searchInput");
const suggestionsList = document.querySelector("#suggestionsList");
let timeoutId;

searchInput.addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    const searchTerm = searchInput.value;
    if (!searchTerm) {
      suggestionsList.innerHTML = "";
      return;
    }
    try {
      console.log("Fetching suggestions...");
      const response = await fetch(`/intelligence/suggestions?q=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const suggestions = await response.json();
      suggestionsList.innerHTML = "";
      suggestions.forEach((suggestion) => {
        const li = document.createElement("li");
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 750);
});
