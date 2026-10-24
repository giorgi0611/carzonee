const THEME_KEY = "carzoneTheme";
function showdark() {
  setTheme("dark");
}
function showlight() {
  setTheme("light");
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}
const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "light" ? "light" : "dark");

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const notification = document.getElementById("notification");
  let notificationTimer;

  if (!contactForm || !nameInput || !notification) {
    console.error("Contact form elements not found. Check the HTML IDs.");
    return;
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }
    notification.textContent = `${name}, your message was sent!`;
    notification.classList.add("show");
    clearTimeout(notificationTimer);
    notificationTimer = setTimeout(function () {
      notification.classList.remove("show");
    }, 3000);
    contactForm.reset();
  });
});