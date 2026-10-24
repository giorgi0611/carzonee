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
(function loadSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  setTheme(savedTheme === "light" ? "light" : "dark");
})();
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".stat-number");
  const duration = 2000;
  counters.forEach(function (counter) {
    const target = Number(counter.dataset.target);
    const startTime = performance.now();
    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentNumber = Math.floor(progress * target);
      counter.textContent = currentNumber.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + "+";
      }
    }
    requestAnimationFrame(updateCounter);
  });
});
