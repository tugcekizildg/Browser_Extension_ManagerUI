const toggleBtn = document.getElementById("themeToggle");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

// Toggle theme
function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  updateIcons(newTheme);
}

// Updating icons for chosen theme
function updateIcons(theme) {
  if (theme === "dark") {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}

// Saved theme
const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);
updateIcons(savedTheme);

toggleBtn.addEventListener("click", toggleTheme);

// Filter extensions
const extensionsCards = document.getElementById("extensionsCards");
const filterContainer = document.getElementById("filterContainer");
const filterBtns = document.querySelectorAll(".filter-btn");

//Fetches the JSON data and displays the cards based on the current filter.
let filteredData = [];
let currentFilter = "all";

async function fetchData() {
  const res = await fetch("./data.json");
  filteredData = await res.json();
  applyFilter(currentFilter);
}

//Dynamically generates HTML elements for each extension and appends them to the container.
function showExtensions(extensions) {
  extensionsCards.innerHTML = "";

  extensions.forEach((extension) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.dataset.name = extension.name;

    item.innerHTML = `
    <div class="top">
        <img src="${extension.logo}" alt="${extension.name}" />
        <div class="info">
            <div class="name">${extension.name}</div>
            <div class="description">${extension.description}</div>
        </div>
    </div>
    <div class="bottom">
        <button class="remove">Remove</button>
        <div class="toggle-container">
        <input class="toggle-input" id="toggle-${
          extension.name
        }" type="checkbox" ${extension.isActive ? "checked" : ""}/>
        <label class="toggle-label" for="toggle-${extension.name}"></label>
        </div>
    </div>
    `;

    extensionsCards.appendChild(item);
  });
}

//Filters the extensions based on the selected filter and updates the UI accordingly.
function applyFilter(filter) {
  currentFilter = filter;

  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.id === filter);
  });

  let filteredExtensions;
  switch (filter) {
    case "all":
      filteredExtensions = filteredData;
      break;
    case "active":
      filteredExtensions = filteredData.filter(
        (extension) => extension.isActive
      );
      break;
    case "inactive":
      filteredExtensions = filteredData.filter(
        (extension) => !extension.isActive
      );
      break;
  }

  showExtensions(filteredExtensions);
}

// Event listeners
filterContainer.addEventListener("click", handleFilterClick);

extensionsCards.addEventListener("click", handleCardClick);

extensionsCards.addEventListener("change", handleToggle);

//Handles filter button clicks and applies the corresponding filter.
function handleFilterClick(e) {
  if (e.target.classList.contains("filter-btn")) {
    applyFilter(e.target.id);
  }
}

//Handles the 'Remove' button click by toggling the active status of the selected extension and reapplying the current filter.
function handleCardClick(e) {
  if (e.target.classList.contains("remove")) {
    const card = e.target.closest(".item");
    const name = card.dataset.name;
    const index = filteredData.findIndex((item) => item.name === name);
    filteredData[index].isActive = !filteredData[index].isActive;
    applyFilter(currentFilter);
  }
}

//Updates the isActive status of an extension when its toggle switch is changed.
function handleToggle(e) {
  if (e.target.classList.contains("toggle-input")) {
    const card = e.target.closest(".item");
    const name = card.dataset.name;

    const extension = filteredData.find((item) => item.name === name);
    extension.isActive = e.target.checked;
  }
}

//Fetches the data and displays the initial set of cards based on the default filter.
fetchData();
