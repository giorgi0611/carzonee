
document.addEventListener("DOMContentLoaded", function () {
  const CUSTOM_CARS_KEY = "carzoneCustomCars";
  const FAVORITES_KEY = "carzoneFavorites";
  const CART_KEY = "carzoneCart";
  const container = document.getElementById("cars-container");
  const pagination = document.getElementById("pagination");
  const carsPerPage = 8;
  let currentPage = 1;
  const search = document.getElementById("search");
  const brandFilter = document.getElementById("filter-brand");
  const fuelFilter = document.getElementById("filter-fuel");
  const transmissionFilter = document.getElementById("filter-mechanic");
  const priceFilter = document.getElementById("filter-min");
  const sortSelect = document.getElementById("sort");
  const favoritesCount = document.getElementById("favorites-count");
  const cartCount = document.getElementById("cart-count");
  const minSlider = document.getElementById("min-price-slider");
  const maxSlider = document.getElementById("max-price-slider");
  const minValue = document.getElementById("min-price-value");
  const maxValue = document.getElementById("max-price-value");
  const resetPriceButton = document.getElementById("reset-price-slider");
  if (!container) {
    console.error("Could not find #cars-container.");
    return;
  }
  function readArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }
  function saveArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function getCarName(card) {
    return card.querySelector(".texts h1")?.textContent.trim() || "";
  }
  function getCardImage(card) {
    return card.querySelector("img")?.getAttribute("src") || "";
  }
  function getCarPrice(card) {
    return Number(card.dataset.price) || 0;
  }
  function getFavorites() {
    return readArray(FAVORITES_KEY);
  }
  function getCart() {
    return readArray(CART_KEY);
  }
  function updateFavoritesCount() {
    if (favoritesCount) {
      favoritesCount.textContent = getFavorites().length;
    }
  }
  function updateCartCount() {
    if (cartCount) {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      cartCount.textContent = total;
    }
  }
  function createCarCard(car) {
    const card = document.createElement("div");
    card.className = "car-card";
    card.dataset.year = String(car.year);
    card.dataset.price = String(car.price);
    card.dataset.brand = car.brand;
    card.dataset.fuel = car.fuel;
    card.dataset.mechanic = car.transmission;
    card.dataset.customCarId = car.id;
    const image = document.createElement("img");
    image.src = car.image;
    image.alt = car.name;
    const texts = document.createElement("div");
    texts.className = "texts";
    const title = document.createElement("h1");
    title.textContent = car.name;
    const year = document.createElement("p");
    year.textContent = "Year: " + car.year;
    const fuel = document.createElement("p");
    fuel.textContent = "Fuel: " + car.fuel;
    const transmission = document.createElement("p");
    transmission.textContent = "Transmission: " + car.transmission;
    const price = document.createElement("p");
    price.textContent = "Price: $" + Number(car.price).toLocaleString();
    const buttons = document.createElement("div");
    buttons.className = "fav-det-add";
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "fav-btn";
    favoriteButton.textContent = "★";
    favoriteButton.setAttribute("aria-label", "Add to favorites");
    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "details-btn";
    detailsButton.textContent = "Details";
    const cartButton = document.createElement("button");
    cartButton.type = "button";
    cartButton.className = "add-btn";
    cartButton.textContent = "Add To Cart";
    buttons.append(favoriteButton, detailsButton, cartButton);
    texts.append(title, year, fuel, transmission, price, buttons);
    card.append(image, texts);
    return card;
  }
  function loadCustomCars() {
    const savedCars = readArray(CUSTOM_CARS_KEY);
    const existingIds = new Set(Array.from(container.querySelectorAll(".car-card")).map((card) => card.dataset.customCarId).filter(Boolean));
    savedCars.forEach((car) => {
      if (!car || !car.id || existingIds.has(car.id)) return;
      if (!car.name || !car.image || !Number.isFinite(Number(car.price)) || !Number.isFinite(Number(car.year))) return;
      container.appendChild(createCarCard(car));
    });
  }
  const originalOrder = [];
  function rememberOriginalOrder() {
    container.querySelectorAll(".car-card").forEach((card) => {
      if (!originalOrder.includes(card)) originalOrder.push(card);
    });
  }
  function updateFavoriteButtons() {
    const favorites = getFavorites();
    container.querySelectorAll(".car-card").forEach((card) => {
      const name = getCarName(card);
      const button = card.querySelector(".fav-btn");
      if (!name || !button) return;
      const isFavorite = favorites.includes(name);
      card.dataset.favorited = String(isFavorite);
      button.textContent = isFavorite ? "♥" : "★";
      button.classList.toggle("is-favorite", isFavorite);
      button.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
    });
  }
  function updateCartButtons() {
    const cart = getCart();
    container.querySelectorAll(".car-card").forEach((card) => {
      const name = getCarName(card);
      const button = card.querySelector(".add-btn");
      if (!name || !button) return;
      const inCart = cart.some((item) => typeof item === "object" && item.name === name);
      button.textContent = inCart ? "Add Another" : "Add To Cart";
    });
  }
  function filterCars() {
    const selectedBrand = brandFilter?.value || "all";
    const selectedFuel = fuelFilter?.value || "all";
    const selectedTransmission = transmissionFilter?.value || "all";
    const selectedPrice = priceFilter?.value || "all";
    const query = search?.value.trim().toLowerCase() || "";
    const cards = Array.from(container.querySelectorAll(".car-card"));
    const prices = cards.map(getCarPrice);
    const lowestPrice = prices.length ? Math.min(...prices) : 0;
    const highestPrice = prices.length ? Math.max(...prices) : 0;
    const sliderMin = minSlider ? Number(minSlider.value) : 0;
    const sliderMax = maxSlider ? Number(maxSlider.value) : Infinity;
    const matchingCards = [];
    cards.forEach((card) => {
      const name = getCarName(card).toLowerCase();
      const brand = (card.dataset.brand || "").toLowerCase();
      const fuel = (card.dataset.fuel || "").toLowerCase();
      const transmission = (card.dataset.mechanic || "").toLowerCase();
      const price = getCarPrice(card);
      const matches = (selectedBrand === "all" || brand === selectedBrand.toLowerCase()) && (selectedFuel === "all" || fuel === selectedFuel.toLowerCase()) && (selectedTransmission === "all" || transmission === selectedTransmission.toLowerCase()) && name.includes(query) && (selectedPrice === "all" || (selectedPrice === "min" && price === lowestPrice) || (selectedPrice === "max" && price === highestPrice)) && price >= sliderMin && price <= sliderMax;
      if (matches) matchingCards.push(card);
    });
    const totalPages = Math.ceil(matchingCards.length / carsPerPage);
    currentPage = Math.min(currentPage, Math.max(totalPages, 1));
    const firstCard = (currentPage - 1) * carsPerPage;
    cards.forEach((card) => {
      card.style.display = "none";
    });
    matchingCards.forEach((card, index) => {
      if (index >= firstCard && index < firstCard + carsPerPage) card.style.display = "";
    });
    renderPagination(totalPages);
  }
  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.replaceChildren();
    pagination.style.display = totalPages > 1 ? "flex" : "none";
    if (totalPages <= 1) return;
    for (let page = 1; page <= totalPages; page++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pagination-button";
      button.textContent = String(page);
      button.setAttribute("aria-label", `Go to page ${page}`);
      button.setAttribute("aria-current", page === currentPage ? "page" : "false");
      button.classList.toggle("active", page === currentPage);
      button.addEventListener("click", () => {
        currentPage = page;
        filterCars();
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      pagination.appendChild(button);
    }
  }
  function sortCars() {
    const cards = Array.from(container.querySelectorAll(".car-card"));
    switch (sortSelect?.value || "default") {
      case "low-to-high":
        cards.sort((a, b) => getCarPrice(a) - getCarPrice(b));
        break;
      case "high-to-low":
        cards.sort((a, b) => getCarPrice(b) - getCarPrice(a));
        break;
      case "a-to-z":
        cards.sort((a, b) => getCarName(a).localeCompare(getCarName(b)));
        break;
      case "z-to-a":
        cards.sort((a, b) => getCarName(b).localeCompare(getCarName(a)));
        break;
      case "newest-to-oldest":
        cards.sort((a, b) => Number(b.dataset.year || 0) - Number(a.dataset.year || 0));
        break;
      case "oldest-to-newest":
        cards.sort((a, b) => Number(a.dataset.year || 0) - Number(b.dataset.year || 0));
        break;
      default:
        cards.sort((a, b) => originalOrder.indexOf(a) - originalOrder.indexOf(b));
    }
    cards.forEach((card) => container.appendChild(card));
    filterCars();
  }
  // PRICE SLIDER SETUP
  function setupPriceSliders() {
    if (!minSlider || !maxSlider) return;
    const prices = Array.from(container.querySelectorAll(".car-card")).map(getCarPrice).filter((price) => price > 0);
    const highestPrice = prices.length ? Math.max(...prices) : 200000;
    const sliderMaximum = Math.max(200000, Math.ceil(highestPrice / 1000) * 1000);
    minSlider.min = "0";
    minSlider.max = String(sliderMaximum);
    minSlider.step = "500";
    minSlider.value = "0";
    maxSlider.min = "0";
    maxSlider.max = String(sliderMaximum);
    maxSlider.step = "500";
    maxSlider.value = String(sliderMaximum);
    updatePriceSlider();
  }
  function updatePriceSlider() {
    if (!minSlider || !maxSlider) return;
    let minPrice = Number(minSlider.value);
    let maxPrice = Number(maxSlider.value);
    if (minPrice > maxPrice) {
      if (document.activeElement === minSlider) {
        minPrice = maxPrice;
        minSlider.value = String(minPrice);
      } else {
        maxPrice = minPrice;
        maxSlider.value = String(maxPrice);
      }
    }
    if (minValue) minValue.textContent = minPrice.toLocaleString();
    if (maxValue) maxValue.textContent = maxPrice.toLocaleString();
    currentPage = 1;
    filterCars();
  }
  minSlider?.addEventListener("input", updatePriceSlider);
  maxSlider?.addEventListener("input", updatePriceSlider);
  resetPriceButton?.addEventListener("click", function () {
    if (!minSlider || !maxSlider) return;
    minSlider.value = minSlider.min;
    maxSlider.value = maxSlider.max;
    updatePriceSlider();
  });
  // CAR DETAILS MODAL
  const overlay = document.createElement("div");
  overlay.id = "car-modal-overlay";
  overlay.innerHTML = `
    <div id="car-modal-box">
      <button id="car-modal-close" type="button" aria-label="Close">&times;</button>
      <div id="car-modal-content"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  const modalContent = overlay.querySelector("#car-modal-content");
  const closeButton = overlay.querySelector("#car-modal-close");
  let activeCard = null;
  let placeholder = null;
  function openDetails(card) {
    if (activeCard) return;
    activeCard = card;
    placeholder = document.createComment("Original car position");
    card.parentNode.insertBefore(placeholder, card);
    modalContent.appendChild(card);
    overlay.classList.add("active");
    document.body.classList.add("modal-open");
    closeButton.focus();
  }
  function closeDetails() {
    if (!activeCard || !placeholder) return;
    placeholder.parentNode.insertBefore(activeCard, placeholder);
    placeholder.remove();
    activeCard = null;
    placeholder = null;
    overlay.classList.remove("active");
    document.body.classList.remove("modal-open");
    filterCars();
  }
  closeButton.addEventListener("click", closeDetails);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeDetails();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetails();
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const favoriteButton = target.closest(".fav-btn");
    if (favoriteButton) {
      const card = favoriteButton.closest(".car-card");
      const name = card && getCarName(card);
      if (!name) return;
      let favorites = getFavorites();
      let added;
      if (favorites.includes(name)) {
        favorites = favorites.filter((item) => item !== name);
        added = false;
      } else {
        favorites.push(name);
        added = true;
      }
      saveArray(FAVORITES_KEY, favorites);
      updateFavoriteButtons();
      updateFavoritesCount();
      showFavoritesNotification(name, added);
      return;
    }
    const cartButton = target.closest(".add-btn");
    if (cartButton) {
      const card = cartButton.closest(".car-card");
      if (!card) return;
      const name = getCarName(card);
      const price = getCarPrice(card);
      const image = getCardImage(card);
      if (!name || price <= 0) {
        alert("This car is missing a valid name or price.");
        return;
      }
      const cart = getCart();
      const existing = cart.find((item) => typeof item === "object" && item.name === name);
      if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + 1;
      } else {
        cart.push({ name: name, price: price, image: image, quantity: 1 });
      }
      saveArray(CART_KEY, cart);
      updateCartButtons();
      updateCartCount();
      showCartNotification(name);
      return;
    }
    const detailsButton = target.closest(".details-btn");
    if (detailsButton) {
      const card = detailsButton.closest(".car-card");
      if (card) openDetails(card);
    }
  });
  // DARK AND LIGHT MODE
  window.showdark = function () {
    document.body.style.backgroundColor = "#0b0d10";
    document.body.style.color = "#f5f5f5";
  };
  window.showlight = function () {
    document.body.style.backgroundColor = "#f5f5f5";
    document.body.style.color = "#111";
  };
  // CAR COMPARISON
  const compareSelect1 = document.getElementById("compare-car-1");
  const compareSelect2 = document.getElementById("compare-car-2");
  const compareButton = document.getElementById("compare-button");
  const compareResults = document.getElementById("compare-results");
  const compareMessage = document.getElementById("compare-message");
  function getAllCarCards() {
    return Array.from(container.querySelectorAll(".car-card"));
  }
  function getCarSpecifications(card) {
    const specifications = {};
    card.querySelectorAll(".texts p").forEach((paragraph) => {
      const text = paragraph.textContent.trim();
      const separator = text.indexOf(":");
      if (separator !== -1) {
        const label = text.slice(0, separator).trim();
        const value = text.slice(separator + 1).trim();
        if (label && value) specifications[label] = value;
      }
    });
    specifications["Brand"] = card.dataset.brand || "Not specified";
    specifications["Model"] = getCarName(card) || "Not specified";
    specifications["Year"] = card.dataset.year || "Not specified";
    specifications["Price"] = card.dataset.price && Number.isFinite(Number(card.dataset.price)) ? "$" + Number(card.dataset.price).toLocaleString() : "Not specified";
    specifications["Fuel"] = card.dataset.fuel || "Not specified";
    specifications["Transmission"] = card.dataset.mechanic || "Not specified";
    return specifications;
  }
  function fillCompareSelectors() {
    if (!compareSelect1 || !compareSelect2) return;
    const previous1 = compareSelect1.value;
    const previous2 = compareSelect2.value;
    const cards = getAllCarCards();
    [compareSelect1, compareSelect2].forEach((select) => {
      select.replaceChildren(new Option("Choose a car", ""));
    });
    cards.forEach((card, index) => {
      const name = getCarName(card);
      const value = card.dataset.customCarId ? "custom:" + card.dataset.customCarId : "car:" + index;
      card.dataset.compareId = value;
      compareSelect1.add(new Option(name, value));
      compareSelect2.add(new Option(name, value));
    });
    if ([...compareSelect1.options].some((option) => option.value === previous1)) compareSelect1.value = previous1;
    if ([...compareSelect2.options].some((option) => option.value === previous2)) compareSelect2.value = previous2;
  }
  function renderComparedCar(card) {
    const panel = document.createElement("article");
    panel.className = "compare-car";
    const image = document.createElement("img");
    image.src = getCardImage(card);
    image.alt = getCarName(card);
    const title = document.createElement("h3");
    title.textContent = getCarName(card);
    panel.append(image, title);
    const specifications = getCarSpecifications(card);
    Object.entries(specifications).forEach(([label, value]) => {
      const row = document.createElement("p");
      const heading = document.createElement("strong");
      heading.textContent = label + ": ";
      row.append(heading, document.createTextNode(value));
      panel.appendChild(row);
    });
    return panel;
  }
  function compareSelectedCars() {
    if (!compareSelect1 || !compareSelect2 || !compareResults) return;
    const firstId = compareSelect1.value;
    const secondId = compareSelect2.value;
    compareResults.replaceChildren();
    if (!firstId || !secondId) {
      if (compareMessage) compareMessage.textContent = "Please choose both cars.";
      return;
    }
    if (firstId === secondId) {
      if (compareMessage) compareMessage.textContent = "Please choose two different cars.";
      return;
    }
    const cards = getAllCarCards();
    const firstCar = cards.find((card) => card.dataset.compareId === firstId);
    const secondCar = cards.find((card) => card.dataset.compareId === secondId);
    if (!firstCar || !secondCar) {
      if (compareMessage) compareMessage.textContent = "A selected car is no longer available. Please choose again.";
      fillCompareSelectors();
      return;
    }
    const grid = document.createElement("div");
    grid.className = "compare-grid";
    grid.append(renderComparedCar(firstCar), renderComparedCar(secondCar));
    compareResults.appendChild(grid);
    if (compareMessage) compareMessage.textContent = "Comparison results";
  }
  compareButton?.addEventListener("click", compareSelectedCars);
  // CONNECT FILTERS
  function resetPageAndFilter() {
    currentPage = 1;
    filterCars();
  }
  search?.addEventListener("input", resetPageAndFilter);
  brandFilter?.addEventListener("change", resetPageAndFilter);
  fuelFilter?.addEventListener("change", resetPageAndFilter);
  transmissionFilter?.addEventListener("change", resetPageAndFilter);
  priceFilter?.addEventListener("change", resetPageAndFilter);
  sortSelect?.addEventListener("change", sortCars);
  // INITIALIZE
  loadCustomCars();
  rememberOriginalOrder();
  setupPriceSliders();
  fillCompareSelectors();
  updateFavoriteButtons();
  updateFavoritesCount();
  updateCartButtons();
  updateCartCount();
  filterCars();
});
let notificationTimer;
function showCartNotification(carName) {
  const notification = document.getElementById("cart-notification");
  const message = document.getElementById("notification-message");
  if (!notification || !message) {
    console.error("Notification HTML not found!");
    return;
  }
  message.textContent = `Car ${carName} was added to the cart!`;
  notification.classList.add("show");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(function () {
    notification.classList.remove("show");
  }, 2000);
}
let favoritesNotificationTimer;
function showFavoritesNotification(carName, added) {
  const notification = document.getElementById("favorites-notification");
  const message = document.getElementById("favorites-notification-message");
  if (!notification || !message) {
    console.error("Favorites notification HTML not found!");
    return;
  }
  if (added) {
    message.textContent = `Car ${carName} was added to favorites`;
  } else {
    message.textContent = `Car ${carName} was removed from favorites`;
  }
  notification.classList.add("show");
  clearTimeout(favoritesNotificationTimer);
  favoritesNotificationTimer = setTimeout(function () {
    notification.classList.remove("show");
  }, 2000);
}
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu-panel");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      mobileMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}