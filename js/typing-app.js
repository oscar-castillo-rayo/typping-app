const keyPressed = document.getElementById('key-pressed');
const typingTextContainer = document.getElementById('typing-text');
const backbutton = document.getElementById('typing-back-button');
const wpm = document.getElementById('wpm');
const timerDisplay = document.getElementById('timer');
const idleOverlay = document.getElementById('idle-overlay');

let textIndex = 0;
const text = getTypingText();
let chars = [];
let totalTextCharacters = text.length;

// ── ATS Timer State ──
let timerStarted = false; // Has the user typed the first key?
let timerPaused = false; // Is the timer paused due to idle?
let startTime = 0; // Date.now() when current segment started
let accumulatedMs = 0; // Total ms accumulated from previous segments
let idleTimeoutId = null; // setTimeout ID for idle detection
let animFrameId = null; // requestAnimationFrame ID for live display
let lessonComplete = false; // Has the user finished the entire text?

const IDLE_TIMEOUT_MS = 10000; // 10 seconds

// ── Helper: get total elapsed ms ──
function getTotalElapsedMs() {
  if (!timerStarted) return 0;
  if (timerPaused) return accumulatedMs;
  return accumulatedMs + (Date.now() - startTime);
}

// ── Format ms into M:SS.ms ──
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

// ── Live timer display loop ──
function updateTimerDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(getTotalElapsedMs());
  }
  if (timerStarted && !timerPaused) {
    animFrameId = requestAnimationFrame(updateTimerDisplay);
  }
}

// ── Start the timer (first keystroke) ──
function startTimer() {
  timerStarted = true;
  timerPaused = false;
  startTime = Date.now();
  accumulatedMs = 0;
  hideIdleOverlay();
  updateTimerDisplay();
}

// ── Pause the timer (idle 10s) ──
function pauseTimer() {
  if (!timerStarted || timerPaused || lessonComplete) return;
  accumulatedMs += Date.now() - startTime;
  timerPaused = true;
  if (animFrameId) cancelAnimationFrame(animFrameId);
  showIdleOverlay();
}

// ── Stop the timer permanently (lesson finished) ──
function stopTimer() {
  if (!timerStarted) return;
  if (!timerPaused) {
    accumulatedMs += Date.now() - startTime;
  }
  timerPaused = true;
  lessonComplete = true;
  if (idleTimeoutId) clearTimeout(idleTimeoutId);
  if (animFrameId) cancelAnimationFrame(animFrameId);
  idleTimeoutId = null;
  // Final display update
  if (timerDisplay) timerDisplay.textContent = formatTime(accumulatedMs);
}

// ── Resume the timer (keystroke after idle) ──
function resumeTimer() {
  if (!timerPaused) return;
  timerPaused = false;
  startTime = Date.now();
  hideIdleOverlay();
  updateTimerDisplay();
}

// ── Reset the timer completely ──
function resetTimer() {
  timerStarted = false;
  timerPaused = false;
  startTime = 0;
  accumulatedMs = 0;
  if (idleTimeoutId) clearTimeout(idleTimeoutId);
  if (animFrameId) cancelAnimationFrame(animFrameId);
  idleTimeoutId = null;
  lessonComplete = false;
  hideIdleOverlay();
  if (timerDisplay) timerDisplay.textContent = '0:00.0';
  wpm.textContent = '0';
}

// ── Reset the idle countdown ──
function resetIdleTimeout() {
  if (idleTimeoutId) clearTimeout(idleTimeoutId);
  idleTimeoutId = setTimeout(() => {
    pauseTimer();
  }, IDLE_TIMEOUT_MS);
}

// ── Overlay helpers ──
function showIdleOverlay() {
  if (idleOverlay) idleOverlay.classList.add('visible');
}
function hideIdleOverlay() {
  if (idleOverlay) idleOverlay.classList.remove('visible');
}

// ── Count correct characters ──
function countCorrectChars() {
  let count = 0;
  for (let i = 0; i < textIndex; i++) {
    if (chars[i] && chars[i].classList.contains('correct')) {
      count++;
    }
  }
  return count;
}

// ── ATS WPM Calculation: (correctChars / 5) / (ms / 60000) ──
function calculateWPM() {
  const elapsedMs = getTotalElapsedMs();
  if (elapsedMs === 0) return 0;
  const correctChars = countCorrectChars();
  const words = correctChars / 5;
  const minutes = elapsedMs / 60000;
  return Math.round(words / minutes);
}

function initializeTyping() {
  typingTextContainer.innerHTML = '';
  chars = [];

  if (!text) {
    typingTextContainer.innerHTML =
      '<span class="char">Please configure a text first.</span>';
    return;
  }

  // Create span for each character
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i];
    span.classList.add('char');
    typingTextContainer.appendChild(span);
    chars.push(span);
  }

  // Set first char as active
  if (chars.length > 0) {
    chars[0].classList.add('current');
  }
}

document.addEventListener('keydown', (event) => {
  // If lesson is complete, ignore all keystrokes
  if (lessonComplete) return;

  if (event.key === 'Backspace') {
    keyPressed.textContent = '←';
    if (textIndex > 0) {
      chars[textIndex].classList.remove('current', 'incorrect', 'correct');
      textIndex--;
      chars[textIndex].classList.remove('correct', 'incorrect');
      chars[textIndex].classList.add('current');

      // If all characters are deleted, reset the timer
      if (textIndex === 0) {
        resetTimer();
      } else {
        resetIdleTimeout();
      }
    }
    wpm.textContent = calculateWPM();
    return;
  }

  if (event.key.length === 1) {
    keyPressed.textContent = event.key;

    // ── Timer logic on keystroke ──
    if (!timerStarted) {
      startTimer();
    } else if (timerPaused) {
      resumeTimer();
    }
    resetIdleTimeout();

    if (textIndex < text.length) {
      if (text[textIndex] === event.key) {
        chars[textIndex].classList.remove('current');
        chars[textIndex].classList.add('correct');
      } else {
        chars[textIndex].classList.remove('current');
        chars[textIndex].classList.add('incorrect');
      }

      textIndex++;

      if (textIndex < text.length) {
        chars[textIndex].classList.add('current');
      }
    }
    if (textIndex === text.length) {
      stopTimer();
      wpm.textContent = calculateWPM();
      return;
    }
  }
  if (event.code === 'Space') {
    keyPressed.textContent = 'Space';
    event.preventDefault();
    return;
  }
  wpm.textContent = calculateWPM();
});

if (backbutton) {
  backbutton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

function getTypingText() {
  try {
    const storedText = localStorage.getItem('typing-text');
    if (storedText) {
      return storedText;
    }
    const defaultText =
      'This is a sample text to demonstrate how typing speed is calculated.';

    return defaultText;
  } catch (error) {
    console.error(error);
    return 'Error loading text.';
  }
}

initializeTyping();
