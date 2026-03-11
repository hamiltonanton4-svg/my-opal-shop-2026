const PRODUCT_STORAGE_KEY = "opalwave_products";
const CART_STORAGE_KEY = "opalwave_cart";

// --- HELPERS ---
const money = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val || 0);

// --- DATA ACCESS ---
function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  // Note: Ensure DEMO_PRODUCTS is defined in your products.js file
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

// --- UI COMPONENTS ---
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
          <a href="shop.html" class="${path === "shop.html" ? "active" : ""}">Collections</a>
          <a href="cart.html" class="${path === "cart.html" ? "active" : ""}">
            Bag <span class="cart-badge" id="cartBadge">0</span>
          </a>
        </nav>
      </div>
    </header>
  `;
}

function productCard(product) {
  return `
    <article class="product-card reveal">
      <div class="product-image-container">
        <a href="product.html?slug=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </a>
      </div>
      <div class="product-card-body">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="price-row">
          <span class="price">${money(product.price)}</span>
        </div>
        <button class="btn btn-primary full" onclick="addToCart('${product.id}')" style="width:100%; margin-top:1rem;">Add to Bag</button>
      </div>
    </article>
  `;
}

// --- ACTIONS ---
function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => String(item.id) === String(productId));

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
  alert(`${product.name} added to bag!`);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
  }
}

// --- INITIALIZE ---
function homeInit() {
  const featured = document.getElementById("featured-products");
  const categoriesWrap = document.getElementById("home-categories");
  const products = getProducts();

  if (featured) {
    const featuredItems = products.filter(p => p.featured).slice(0, 4);
    featured.innerHTML = featuredItems.map(productCard).join("");
  }

  if (categoriesWrap) {
    const cats = [...new Set(products.map(p => p.category))];
    categoriesWrap.innerHTML = cats.map(cat => `
      <a class="category-card reveal" href="shop.html?category=${cat}" style="text-decoration:none; color:inherit;">
        <div style="padding:2rem; background:var(--glass); border-radius:20px; border:1px solid var(--border);">
          <h3 style="margin-bottom:0.5rem;">${cat}</h3>
          <p style="font-size:0.8rem; color:var(--text-soft);">Explore Collection</p>
        </div>
      </a>
    `).join("");
  }
  
  initReveal();
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  updateCartBadge();
  homeInit();
});
