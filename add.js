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
function getcustomcars() {
    try {
        const cars = JSON.parse(
            localStorage.getItem(CUSTOM_CARS_KEY) || "[]"
        );
        return Array.isArray(cars) ? cars : [];
    } catch {
        return [];
    }
}
function addcar() {
    const brandInput = document.getElementById("brand");
    const modelInput = document.getElementById("model");
    const yearInput = document.getElementById("year");
    const priceInput = document.getElementById("price");
    const fuelInput = document.getElementById("fuel");
    const transmissionInput = document.getElementById("transmision");
    const imageInput = document.getElementById("image");
    if (
        !brandInput || !modelInput || !yearInput || !priceInput ||
        !fuelInput || !transmissionInput || !imageInput
    ) {
        alert("One or more form fields could not be found.");
        return;
    }
    const brand = brandInput.value.trim();
    const model = modelInput.value.trim();
    const year = Number(yearInput.value);
    const price = Number(priceInput.value);
    const fuel = fuelInput.value.trim().toLowerCase();
    const transmision = transmissionInput.value.trim().toLowerCase();
    const imagefile = imageInput.files[0];
    if (!brand || !model || !fuel || !transmision) {
        alert("Please fill in all the car details.");
        return;
    }
    if (
        !Number.isInteger(year) ||
        year < 1886 ||
        year > new Date().getFullYear() + 1
    ) {
        alert("Please enter a valid car year.");
        return;
    }
    if (!Number.isFinite(price) || price <= 0) {
        alert("Please enter a price greater than 0.");
        return;
    }
    if (!imagefile) {
        alert("Please select a car image.");
        return;
    }
    if (!imagefile.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        const cars = getcustomcars();
        const car = {
            id: "custom-" + Date.now() + "-" +
                Math.random().toString(36).slice(2, 8),
            brand: brand.toLowerCase().replace(/\s+/g, "-"),
            brandLabel: brand,
            model: model,
            name: (brand + " " + model).toUpperCase(),
            year: year,
            price: price,
            fuel: fuel,
            transmision: transmision,
            image: reader.result
        };
        cars.push(car);
        try {
            localStorage.setItem(CUSTOM_CARS_KEY, JSON.stringify(cars));
        } catch (error) {
            alert("The image may be too large to save. Please choose a smaller image.");
            return;
        }
        alert("Your car was added successfully.");
        window.location.href = "search.html";
    };
    reader.onerror = function () {
        alert("Sorry, the image could not be read. Please try again.");
    };
    reader.readAsDataURL(imagefile);
}