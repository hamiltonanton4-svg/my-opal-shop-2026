/* --- OPALWAVE MASTER ENGINE 2026 --- */

const PRODUCT_STORAGE_KEY = "opalwave_products";
const CART_STORAGE_KEY = "opalwave_cart";

// Professional Currency Formatter
const money = (v) => new Intl.NumberFormat("en-US", { 
  style: "currency", 
  currency: "USD",
  minimumFractionDigits: 0 
}).format(v || 0);

// 1. DATA LOADER
function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!stored) {
    // If DEMO_PRODUCTS isn't defined in products.js, this might error. 
    // Ensure products.js is loaded first.
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEMO_PRODUCTS));
    return [...DEMO_PRODUCTS];
  }
  return JSON.parse(stored);
}

// 2. NOIR HEADER RENDERER
function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  
  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  
  header.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="logo">Opalwave</a>
        <nav class="nav">
          <a href="index.html">Home</a>
          <a href="shop.html">Collections</a>
          <a href="bag.html">Bag <span style="color:var(--accent)">[${count}]</span></a>
        </nav>
      </div>
    </header>
  `;
}

// 3. HOME PAGE INITIALIZATION
function homeInit() {
  const products = getProducts().filter(p => p.category !== 'electronics');
  const featuredWrap = document.getElementById("featured-products");
  
  // Render Trending Products (Noir Style)
  if (featuredWrap) {
    const featured = products.filter(p => p.featured).slice(0, 4);
    featuredWrap.innerHTML = featured.map(p => `
      <div class="product-card reveal">
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-info">
          <p class="section-label" style="font-size:0.5rem; margin-bottom:0.2rem;">${p.category}</p>
          <h3 class="product-title">${p.name}</h3>
          <p class="price">${money(p.price)}</p>
          <button class="btn-primary" style="width:100%; margin-top:1rem; padding:0.8rem;" onclick="addToCart('${p.id}')">
            Add to Archive
          </button>
        </div>
      </div>
    `).join("");
  }

  // Scroll Reveal Logic
  initScrollReveal();
}

// 4. GLOBAL ADD TO CART
window.addToCart = function(id) {
  const products = getProducts();
  const p = products.find(item => item.id == id);
  if(!p) return;

  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const existing = cart.find(i => i.id == id);
  
  if (existing) { 
    existing.quantity++; 
  } else { 
    cart.push({...p, quantity: 1}); 
  }
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderHeader();
  
  // High-end notification instead of a basic alert
  const btn = event.target;
  const originalText = btn.innerText;
  btn.innerText = "ADDED TO BAG";
  btn.style.background = "var(--accent)";
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.background = "#fff";
  }, 2000);
};

// 5. SCROLL ANIMATION
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  homeInit();
});
