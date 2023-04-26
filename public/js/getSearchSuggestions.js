const searchInput = document.querySelector("#searchInput");
const suggestionsList = document.querySelector("#suggestionsList");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value;

  fetch(`/search/suggestions?q=${searchTerm}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((suggestions) => {
      suggestionsList.innerHTML = "";
      suggestions.forEach((suggestion) => {
        const li = document.createElement("li");
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching suggestions:", error);
    });
});

