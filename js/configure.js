const configureBackButton = document.getElementById('configure-back-button');
const cardsContainer = document.getElementById('cards-container');
const languageSelect = document.getElementById('language-select');
const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');
const customTextButton = document.getElementById('custom-text-button');
const startButton = document.getElementById('start-button');

if (startButton) {
  startButton.addEventListener('click', () => {
    window.location.href = '../pages/typing-app.html';
  });

  // Typewriter effect
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const phrases = [
      'Click to start!',
      'Ready to type?',
      'Improve your speed!',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, 1800);
          return;
        }
        setTimeout(typeLoop, 80);
      } else {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 40);
      }
    }
    typeLoop();
  }
}

if (configureBackButton) {
  configureBackButton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

async function loadTexts() {
  const response = await fetch('../assets/json/texts.json');
  if (!response.ok) throw new Error('Could not load texts.json');
  return response.json();
}

async function loadCards(difficulty) {
  try {
    const allTexts = await loadTexts();
    const texts = allTexts[difficulty];

    if (!texts || !cardsContainer) return;

    cardsContainer.innerHTML = '';
    texts.forEach((text) => {
      const card = document.createElement('section');
      card.classList.add('card');
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
    console.error('Error loading cards:', err);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadCards('easy');
});

if (easyButton) {
  easyButton.addEventListener('click', () => {
    loadCards('easy');
  });
}

if (mediumButton) {
  mediumButton.addEventListener('click', () => {
    loadCards('medium');
  });
}

if (hardButton) {
  hardButton.addEventListener('click', () => {
    loadCards('hard');
  });
}

if (cardsContainer) {
  cardsContainer.addEventListener('click', async (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    const location = card.dataset.location;
    console.log(location);
    try {
      const response = await fetch(location);
      if (!response.ok) throw new Error('Could not load text file');
      const content = await response.text();
      saveTypingText(content);
      window.location.href = '../pages/typing-app.html';
    } catch (err) {
      console.error('Error loading text file:', err);
    }
  });

  if (customTextButton) {
    customTextButton.addEventListener('click', () => {
      window.location.href = '../pages/custom-text.html';
    });
  }
  function saveTypingText(text) {
    try {
      localStorage.setItem('typing-text', text);
    } catch (error) {
      if (errorMessage) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    }
  }
}
