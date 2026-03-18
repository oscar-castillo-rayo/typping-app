const startTitleTrigger = document.getElementById('start-title-trigger');
const themeToggle = document.getElementById('theme-toggle');
const configureButton = document.getElementById('configure-button');
const recordsButton = document.getElementById('records-button');

if (startTitleTrigger) {
  startTitleTrigger.addEventListener('mouseover', () => {
    startTitleTrigger.classList.add('title-selected');
  });

  startTitleTrigger.addEventListener('mouseout', () => {
    startTitleTrigger.classList.remove('title-selected');
  });

  startTitleTrigger.addEventListener('click', () => {
    startTitleTrigger.classList.add('animate-title');
    setTimeout(() => {
      console.log('click');
      window.location.href = './pages/typing-app.html';
    }, 1500);
  });
}

const themes = ['', 'neon-theme', 'light-theme'];
const themeLabels = ['Light Breeze', 'Neon Cyber', 'Night Owl'];
let currentThemeIndex = 0;

themeToggle.addEventListener('click', () => {
  // Remove current theme class
  if (themes[currentThemeIndex]) {
    document.body.classList.remove(themes[currentThemeIndex]);
  }

  // Advance index
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;

  // Apply new theme
  if (themes[currentThemeIndex]) {
    document.body.classList.add(themes[currentThemeIndex]);
  }

  localStorage.setItem('app-theme-index', currentThemeIndex);
  themeToggle.textContent =
    themeLabels[(currentThemeIndex + 1) % themes.length];
});

document.addEventListener('DOMContentLoaded', () => {
  const savedIndex = localStorage.getItem('app-theme-index');
  if (savedIndex !== null) {
    currentThemeIndex = parseInt(savedIndex, 10);
    if (themes[currentThemeIndex]) {
      document.body.classList.add(themes[currentThemeIndex]);
    }
  }
  themeToggle.textContent =
    themeLabels[(currentThemeIndex + 1) % themes.length];
});

if (configureButton) {
  configureButton.addEventListener('click', () => {
    window.location.href = './pages/configure.html';
  });
}

if (recordsButton) {
  recordsButton.addEventListener('click', () => {
    window.location.href = '../pages/records.html';
  });
}
