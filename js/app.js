const PRODUCT_STORAGE_KEY = "opalwave_products";
const CART_STORAGE_KEY = "opalwave_cart";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value || 0);
}

function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEMO_PRODUCTS));
    return [...DEMO_PRODUCTS];
  }
  return JSON.parse(stored);
}

function setProducts(products) {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

function resetProducts() {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEMO_PRODUCTS));
}

function getCart() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function showToast(message) {
  let toast = document.getElementById("globalToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.__opalwaveToastTimer);
  window.__opalwaveToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      quantity: 1
    });
  }

  setCart(cart);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  setCart(cart);
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = quantity;
  setCart(cart);
}

function clearCart() {
  setCart([]);
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCategories(products = getProducts()) {
  return [...new Set(products.map(p => p.category))].sort();
}

function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const path = window.location.pathname.split("/").pop();

  header.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo">Opalwave</a>
        <nav class="nav">
          <a href="index.html" class="${path === "index.html" || path === "" ? "active" : ""}">Home</a>
          <a href="shop.html" class="${path === "shop.html" ? "active" : ""}">Shop</a>
          <a href="admin.html" class="${path === "admin.html" ? "active" : ""}">Admin</a>
          <a href="cart.html" class="${path === "cart.html" ? "active" : ""}">
            Cart <span class="cart-badge" id="cartBadge">0</span>
          </a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        © ${new Date().getFullYear()} Opalwave. Futuristic shopping, elevated.
      </div>
    </footer>
  `;
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = cartCount();
  }
}

function productCard(product) {
  return `
    <article class="product-card reveal">
      <a href="product.html?slug=${encodeURIComponent(product.slug)}">
        <img src="${product.image}" alt="${product.name}" />
      </a>
      <div class="product-card-body">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="price-row">
          <span class="price">${money(product.price)}</span>
          ${product.compareAt ? `<span class="compare-price">${money(product.compareAt)}</span>` : ""}
        </div>
        <button class="btn btn-primary full" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    </article>
  `;
}

function homeInit() {
  const featured = document.getElementById("featured-products");
  const categoriesWrap = document.getElementById("home-categories");
  if (!featured || !categoriesWrap) return;

  const products = getProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const categories = getCategories(products);

  categoriesWrap.innerHTML = categories.map(category => `
    <a class="category-card reveal" href="shop.html?category=${encodeURIComponent(category)}">
      <h3>${category}</h3>
      <p>Explore products in this collection</p>
    </a>
  `).join("");

  featured.innerHTML = featuredProducts.map(productCard).join("");
  initReveal();
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  updateCartBadge();
  homeInit();
  initReveal();
});