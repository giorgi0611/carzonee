
const STORAGE_KEY = "carzoneFavorites";

const container = document.getElementById("cars-container");
const countElement = document.getElementById("favorites-count");
const emptyMessage = document.getElementById("empty-message");

function getFavorites() {
    try {
        const favorites = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
        return Array.isArray(favorites) ? favorites : [];
    } catch {
        return [];
    }
}

async function loadFavorites() {
    const favorites = getFavorites();
    container.replaceChildren();

    if (countElement) {
        countElement.textContent = favorites.length;
    }

    try {
        const response = await fetch("./cars.html");

        if (!response.ok) {
            throw new Error("Could not load cars.html");
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const allCars = doc.querySelectorAll(".car-card");

        const favoriteNames = new Set(
            favorites.map(name => name.trim().toLowerCase())
        );

        allCars.forEach(car => {
            const heading = car.querySelector(".texts h1");
            if (!heading) return;

            const name = heading.textContent.trim().toLowerCase();

            if (!favoriteNames.has(name)) return;

            const card = document.importNode(car, true);
            const button = card.querySelector(".fav-btn");

            if (button) {
                button.textContent = "♥";
                button.classList.add("is-favorite");
            }

            container.appendChild(card);
        });

        if (emptyMessage) {
            emptyMessage.hidden = container.children.length > 0;
        }

        if (favorites.length > 0 && container.children.length === 0) {
            emptyMessage.hidden = false;
            emptyMessage.textContent =
                "Saved favorites could not be matched with cards in cars.html. " +
                "Make sure the car cards are in that file and their names match.";
        }

    } catch (error) {
        console.error("Favorites loading error:", error);

        if (emptyMessage) {
            emptyMessage.hidden = false;
            emptyMessage.textContent =
                "Could not load cars. Open the website using VS Code Live Server.";
        }
    }
}

loadFavorites();
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
