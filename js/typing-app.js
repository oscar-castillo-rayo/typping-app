const keyPressed = document.getElementById("key-pressed");
const typingTextContainer = document.getElementById("typing-text");
const backbutton = document.getElementById("typing-back-button");

let textIndex = 0;
const text = getTypingText();
let chars = [];

function initializeTyping() {
  typingTextContainer.innerHTML = "";
  chars = [];

  if (!text) {
    typingTextContainer.innerHTML =
      '<span class="char">Please configure a text first.</span>';
    return;
  }

  // Create span for each character
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    // Show spaces explicitly, or just keep them as is.
    // They will take up width naturally.
    span.textContent = text[i];
    span.classList.add("char");
    typingTextContainer.appendChild(span);
    chars.push(span);
  }

  // Set first char as active
  if (chars.length > 0) {
    chars[0].classList.add("current");
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Backspace") {
    keyPressed.textContent = "←";
    if (textIndex > 0) {
      chars[textIndex].classList.remove("current", "incorrect", "correct");
      textIndex--;
      chars[textIndex].classList.remove("correct", "incorrect");
      chars[textIndex].classList.add("current");
    }
    return;
  }

  if (event.key.length === 1) {
    keyPressed.textContent = event.key;

    if (textIndex < text.length) {
      if (text[textIndex] === event.key) {
        chars[textIndex].classList.remove("current");
        chars[textIndex].classList.add("correct");
      } else {
        chars[textIndex].classList.remove("current");
        chars[textIndex].classList.add("incorrect");
      }

      textIndex++;

      if (textIndex < text.length) {
        chars[textIndex].classList.add("current");
      }
    }
  }
  if (event.code === "Space") {
    keyPressed.textContent = "Space";
    event.preventDefault();
    return;
  }
});

if (backbutton) {
  backbutton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}

function getTypingText() {
  try {
    const storedText = localStorage.getItem("typing-text");
    if (storedText) {
      return storedText;
    }
    return "The quick brown fox jumps over the lazy dog. Start typing to see the elegant new design in action!";
  } catch (error) {
    console.error(error);
    return "Error loading text.";
  }
}

initializeTyping();
