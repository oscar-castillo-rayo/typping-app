const configureBackButton = document.getElementById("configure-back-button");
const cardsContainer = document.getElementById("cards-container");
const languageSelect = document.getElementById("language-select");
const easyButton = document.getElementById("easy-button");
const mediumButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");
const customTextButton = document.getElementById("custom-text-button");


if (configureBackButton) {
  configureBackButton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}

async function loadTexts() {
  const response = await fetch("/assets/json/texts.json");
  if (!response.ok) throw new Error("Could not load texts.json");
  return response.json(); 
}

async function loadCards(difficulty) {
  try {
    const allTexts = await loadTexts();
    const texts = allTexts[difficulty];

    if (!texts || !cardsContainer) return;

    cardsContainer.innerHTML = "";
    texts.forEach((text) => {
      const card = document.createElement("section");
      card.classList.add("card");
      card.dataset.location = text.location;
      card.dataset.id = text.id;
      card.innerHTML = `
        <div class="card-text-container">
          <p class="card-name">${text.name}</p>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading cards:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadCards("easy");
});

if (easyButton) {
  easyButton.addEventListener("click", () => {
    loadCards("easy");
  });
}

if (mediumButton) {
  mediumButton.addEventListener("click", () => {
    loadCards("medium");
  });
}

if (hardButton) {
  hardButton.addEventListener("click", () => {
    loadCards("hard");
  });
}

if (cardsContainer) {
  cardsContainer.addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    if (!card) return;
    const location = card.dataset.location;
    console.log(location);
    try {
      const response = await fetch(location);
      if (!response.ok) throw new Error("Could not load text file");
      const content = await response.text();
      saveTypingText(content);
      window.location.href = "/pages/typing-app.html";
    } catch (err) {
      console.error("Error loading text file:", err);
    }
  });

  if (customTextButton) {
    customTextButton.addEventListener("click", () => {
      window.location.href = "/pages/custom-text.html";
    });
  }
}
