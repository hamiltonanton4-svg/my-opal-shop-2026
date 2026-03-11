const PRODUCT_STORAGE_KEY = "opalwave_products";
const CART_STORAGE_KEY = "opalwave_cart";

// --- UTILS ---
const money = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val || 0);

// --- DATA ---
function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEMO_PRODUCTS));
    return [...DEMO_PRODUCTS];
  }
  return JSON.parse(stored);
}

function getCart() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

// --- NEW: STRIPE SUCCESS CHECK ---
function checkSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    localStorage.removeItem(CART_STORAGE_KEY); // Clear the bag after payment
    updateCartBadge();
    
    const container = document.getElementById('cart-items-list');
    if (container) {
      container.innerHTML = `
        <div class="hero reveal show" style="text-align:center; padding: 4rem; grid-column: 1 / -1;">
          <span class="pill">Payment Confirmed</span>
          <h1 style="font-size: 3rem; margin-top: 1rem;">Thank You.</h1>
          <p class="muted">Your order is being prepared for the future. You will receive an email shortly.</p>
          <a href="index.html" class="btn btn-primary" style="margin-top: 2rem;">Return to Archive</a>
        </div>
      `;
      // Hide the summary sidebar on success
      const sidebar = document.querySelector('aside');
      if (sidebar) sidebar.style.display = 'none';
    }
  }
}

// --- NAVIGATION (THE NO-COLLISION VERSION) ---
function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const path = window.location.pathname.split("/").pop() || "index.html";

  header.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo">Opalwave</a>
        <nav class="nav">
          <a href="index.html" class="${path === "index.html" ? "active" : ""}">Home</a>
          <a href="shop.html" class="${path.includes('shop') ? "active" : ""}">Collections</a>
          <a href="./cart.html" class="${path.includes('cart') ? "active" : ""}">
            Bag <span class="cart-badge" id="cartBadge">0</span>
          </a>
        </nav>
      </div>
    </header>
  `;
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
  }
}

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  updateCartBadge();
  checkSuccess(); // Run the check on every load
});
