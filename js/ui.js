const startTitleTrigger = document.getElementById("start-title-trigger");
const themeToggle = document.getElementById("theme-toggle");
const configureButton = document.getElementById("configure-button");
const recordsButton = document.getElementById("records-button");

if (startTitleTrigger) {
  startTitleTrigger.addEventListener("mouseover", () => {
    startTitleTrigger.classList.add("title-selected");
  });

  startTitleTrigger.addEventListener("mouseout", () => {
    startTitleTrigger.classList.remove("title-selected");
  });

  startTitleTrigger.addEventListener("click", () => {
    startTitleTrigger.classList.add("animate-title");
    setTimeout(() => {
      console.log("click");
      window.location.href = "../pages/typing-app.html";
    }, 1500);
  });
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("dark-theme", "enabled");
    themeToggle.textContent = "Light";
  } else {
    localStorage.setItem("dark-theme", "disabled");
    themeToggle.textContent = "Dark";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const darkTheme = localStorage.getItem("dark-theme");
  if (darkTheme === "enabled") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
});

if (configureButton) {
  configureButton.addEventListener("click", () => {
    window.location.href = "../pages/configure.html";
  });
}

if (recordsButton) {
  recordsButton.addEventListener("click", () => {
    window.location.href = "../pages/records.html";
  });
}
