
const configureBackButton = document.getElementById("configure-back-button");

const uploadTextButton = document.getElementById("upload-text-button");
const textInput = document.getElementById("text-input");
const fileInput = document.getElementById("file-input");


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
      window.location.href = "/pages/typing-app.html";
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a text",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  }
}
if (configureBackButton) {
  configureBackButton.addEventListener("click", () => {
    window.location.href = "/pages/configure.html";
  });
}

