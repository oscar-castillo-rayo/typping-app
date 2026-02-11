const configureBackButton = document.getElementById("configure-back-button");

if (configureBackButton) {
  configureBackButton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}

const fileInput = document.getElementById("file-input");
const uploadTextButton = document.getElementById("upload-text-button");
const textInput = document.getElementById("text-input");
const errorMessage = document.getElementById("file-error-message");

try {
  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          textInput.value = content;
        };
        reader.readAsText(file);
      }
    });
  }
} catch (error) {
  if (errorMessage) {
    errorMessage.textContent = error.message;
  }
}

if (uploadTextButton) {
  uploadTextButton.addEventListener("click", () => {
    const text = textInput.value;
    if (text) {
      saveTypingText(text);
    }
  });
}

if (textInput) {
  textInput.addEventListener("input", () => {
    const text = textInput.value;
    if (text) {
      saveTypingText(text);
    }
  });
}

function saveTypingText(text) {
  try {
    localStorage.setItem("typing-text", text);
  } catch (error) {
    if (errorMessage) {
      errorMessage.textContent = error.message;
    }
  }
}
