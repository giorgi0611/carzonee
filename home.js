
const STORAGE_KEY = "carzoneFavorites";

function getFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function updateHomeFavoritesCount() {
    const countElement = document.getElementById("favorites-count");

    if (countElement) {
        countElement.textContent = getFavorites().length;
    }
}
const CART_KEY = "carzonecart";

function getFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function updateHomeCartCount() {
    const countElement = document.getElementById("cart-count");

    if (countElement) {
        countElement.textContent = getCartItems().length;
    }
}
updateHomeCartCount();
const THEME_KEY = "carzoneTheme";
const CUSTOM_CARS_KEY = "carzoneCustomCars";
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
