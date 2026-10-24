
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

updateHomeFavoritesCount();
const loader = document.getElementById("loader");

setTimeout(function () {
    if (loader) {
        loader.style.display = "none";
    }
}, 2000);