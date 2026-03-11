const PRODUCT_STORAGE_KEY = "opalwave_products";
const CART_STORAGE_KEY = "opalwave_cart";

const money = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v || 0);

function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEMO_PRODUCTS));
    return [...DEMO_PRODUCTS];
  }
  return JSON.parse(stored);
}

function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const count = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]").reduce((s, i) => s + i.quantity, 0);
  
  header.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo">Opalwave</a>
        <nav class="nav">
          <a href="index.html">Home</a>
          <a href="shop.html">Collections</a>
          <a href="cart.html">Bag <span class="cart-badge">${count}</span></a>
        </nav>
      </div>
    </header>
  `;
}

function homeInit() {
  const products = getProducts();
  const featuredWrap = document.getElementById("featured-products");
  const categoriesWrap = document.getElementById("home-categories");

  if (featuredWrap) {
    const featured = products.filter(p => p.featured).slice(0, 4);
    featuredWrap.innerHTML = featured.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3 style="margin-top:1rem">${p.name}</h3>
        <p class="price">${money(p.price)}</p>
        <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to Bag</button>
      </div>
    `).join("");
  }

  if (categoriesWrap) {
    const cats = [...new Set(products.map(p => p.category))];
    categoriesWrap.innerHTML = cats.map(c => `
      <div class="product-card" style="text-align:center; padding: 3rem 1rem;">
        <h3>${c}</h3>
        <a href="shop.html?category=${c}" style="color:var(--primary); font-weight:700; text-decoration:none;">Explore Collection →</a>
      </div>
    `).join("");
  }
}

window.addToCart = function(id) {
  const products = getProducts();
  const p = products.find(item => item.id === id);
  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.quantity++; } else { cart.push({...p, quantity: 1}); }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderHeader();
  alert("Added to bag!");
};

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  homeInit();
});
