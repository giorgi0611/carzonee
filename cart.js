
const CART_KEY = "carzoneCart";
let discountApplied = false;

function getCartItems() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Could not read cart:", error);
        return [];
    }
}

function updateCartCount() {
    const cart = getCartItems();
    const count = cart.reduce(
        (total, car) => total + (Number(car.quantity) || 1),
        0
    );

    const element = document.getElementById("cart-count");
    if (element) element.textContent = count;
}

function updateCartSummary(cart) {
    const TAX_RATE = 0.08;
    const SHIPPING_FEE = 500;

    const subtotal = cart.reduce((sum, car) => {
        return sum + (Number(car.price) || 0) *
            Math.max(1, Number(car.quantity) || 1);
    }, 0);

    const discount = discountApplied ? subtotal * 0.10 : 0;
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * TAX_RATE;
    const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
    const total = discountedSubtotal + tax + shipping;

    const money = amount => amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    document.getElementById("cart-subtotal").textContent = money(subtotal);
    document.getElementById("cart-discount").textContent = money(discount);
    document.getElementById("cart-tax").textContent = money(tax);
    document.getElementById("cart-shipping").textContent = money(shipping);
    document.getElementById("cart-total").textContent = money(total);

    console.log("Subtotal:", subtotal, "Discount:", discount, "Total:", total);
}

function renderCart() {
    const container = document.getElementById("cart-container");
    const emptyMessage = document.getElementById("empty-message");

    if (!container || !emptyMessage) {
        console.error("Cart container or empty message is missing.");
        return;
    }

    const cart = getCartItems();
    container.innerHTML = "";
    emptyMessage.hidden = cart.length > 0;

    cart.forEach((car, index) => {
        const price = Number(car.price) || 0;
        const quantity = Math.max(1, Number(car.quantity) || 1);
        const subtotal = price * quantity;

        const card = document.createElement("div");
        card.className = "cart-card";

        const image = document.createElement("img");
        image.className = "cart-car-image";
        image.src = car.image || "";
        image.alt = car.name || "Car";
        image.onerror = function () {
            this.style.display = "none";
        };

        const details = document.createElement("div");
        details.className = "cart-car-details";

        const name = document.createElement("h2");
        name.textContent = car.name || "Car";

        const unitPrice = document.createElement("p");
        unitPrice.textContent = `Price: $${price.toLocaleString("en-US")}`;

        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.className = "quantity-btn";
        minus.textContent = "−";
        minus.disabled = quantity <= 1;
        minus.addEventListener("click", () => {
            cart[index].quantity = quantity - 1;
            saveCart(cart);
        });

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const plus = document.createElement("button");
        plus.className = "quantity-btn";
        plus.textContent = "+";
        plus.addEventListener("click", () => {
            cart[index].quantity = quantity + 1;
            saveCart(cart);
        });

        const subtotalText = document.createElement("p");
        subtotalText.textContent =
            `Subtotal: $${subtotal.toLocaleString("en-US")}`;

        const remove = document.createElement("button");
        remove.className = "remove-cart-btn";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
            cart.splice(index, 1);
            saveCart(cart);
        });

        quantityControls.append(minus, quantityText, plus);
        details.append(name, unitPrice, quantityControls, subtotalText, remove);
        card.append(image, details);
        container.appendChild(card);
    });

    updateCartCount();
    updateCartSummary(cart);
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
}

document.getElementById("apply-discount")?.addEventListener("click", () => {
    const input = document.getElementById("discount-code");
    const message = document.getElementById("discount-message");

    if (!input || !message) return;

    const code = input.value.trim().toUpperCase();

    if (code === "CAR10") {
        discountApplied = true;
        message.textContent = "Success! 10% discount applied!";
        message.style.color = "limegreen";
    } else {
        discountApplied = false;
        message.textContent = "Invalid discount code!";
        message.style.color = "tomato";
        alert("Invalid discount code!");
    }

    updateCartSummary(getCartItems());
});

renderCart();
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