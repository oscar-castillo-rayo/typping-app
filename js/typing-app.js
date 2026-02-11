const keyPressed = document.getElementById("key-pressed");
const typingText = document.getElementById("typing-text");
const backbutton = document.getElementById("typing-back-button");

let textIndex = 0;
const text = getTypingText();

typingText.append(text);

document.addEventListener("keydown", (event) => {
  if (event.key === "Backspace") {
    if (textIndex > 0) {
      textIndex--;
      typingText.textContent = text.slice(textIndex);
    }
    return;
  }
  if (event.key !== null && event.key !== "") {
    keyPressed.textContent = event.key;
    if (text[textIndex].toLowerCase() === event.key.toLowerCase()) {
      textIndex++;
      typingText.textContent = text.slice(textIndex);
    }
  }
});

if (backbutton) {
  backbutton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}

function getTypingText() {
  try {
    const text = localStorage.getItem("typing-text");
    if (text) {
      return text;
    }
    return "";
  } catch (error) {
    console.error(error);
    return "";
  }
}
