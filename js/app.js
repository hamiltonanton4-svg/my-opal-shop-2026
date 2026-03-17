/* --- OPALWAVE MASTER ENGINE 2026 --- */
const PRODUCT_STORAGE_KEY = "opalwave_products";
const CART_STORAGE_KEY = "opalwave_cart";

const money = (v) => new Intl.NumberFormat("en-US", { 
  style: "currency", currency: "USD", minimumFractionDigits: 0 
}).format(v || 0);

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
    </header>`;
}

// Added Global Footer for consistency
function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <footer class="container" style="padding: 6rem 0; border-top: 1px solid var(--border); margin-top: 8rem;">
      <p style="font-size: 0.6rem; letter-spacing: 0.2em; color: var(--text-muted);">© 2026 OPALWAVE ARCHIVE.</p>
    </footer>`;
}

window.addToCart = function(id) {
  const products = getProducts();
  const p = products.find(item => item.id == id);
  if(!p) return;
  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const existing = cart.find(i => i.id == id);
  if (existing) { existing.quantity++; } else { cart.push({...p, quantity: 1}); }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderHeader();
  
  const btn = event.target;
  const oldText = btn.innerText;
  btn.innerText = "ADDED";
  btn.style.background = "var(--accent)";
  setTimeout(() => {
    btn.innerText = oldText;
    btn.style.background = "";
  }, 2000);
};

// Added Scroll Reveal for the "Luxury" feel
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  
  if(document.getElementById("featured-products")) {
    const featured = getProducts().filter(p => p.featured).slice(0, 4);
    document.getElementById("featured-products").innerHTML = featured.map(p => `
      <div class="product-card reveal">
        <div class="product-image-wrap"><img src="${p.image}"></div>
        <div class="product-info">
           <p class="section-label" style="font-size:0.5rem; margin-bottom:0.2rem;">${p.category}</p>
           <h3 class="product-title">${p.name}</h3>
           <p class="price">${money(p.price)}</p>
           <button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="addToCart('${p.id}')">Add to Archive</button>
        </div>
      </div>`).join("");
  }
  
  initReveal();
});
