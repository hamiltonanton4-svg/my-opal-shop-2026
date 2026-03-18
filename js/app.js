/* --- OPALWAVE MASTER ENGINE 2026 --- */
const PRODUCT_STORAGE_KEY = "opalwave_vault_inventory";
const CART_STORAGE_KEY = "opalwave_cart";

const money = (v) => new Intl.NumberFormat("en-US", { 
  style: "currency", currency: "USD", minimumFractionDigits: 0 
}).format(v || 0);

function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : (window.products || []);
}

// Updated to handle specific sizes
window.addToCart = function(id) {
  const allProducts = getProducts();
  const p = allProducts.find(item => item.id == id);
  if(!p) return;

  // 1. Grab the size from the dropdown we built
  const sizeSelector = document.getElementById(`size-select-${id}`);
  const selectedSize = sizeSelector ? sizeSelector.value : "OS"; 

  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  
  // 2. Create a unique ID for the specific size (e.g., "ow-001-L")
  const cartItemId = `${id}-${selectedSize}`;
  const existing = cart.find(i => i.cartId === cartItemId);

  if (existing) {
    existing.quantity++;
  } else {
    // 3. Save the product + the selected size
    cart.push({ ...p, cartId: cartItemId, selectedSize, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderHeader();
  
  const btn = event.target;
  const oldText = btn.innerText;
  btn.innerText = `ADDED [${selectedSize}]`;
  btn.style.background = "var(--accent)";
  setTimeout(() => {
    btn.innerText = oldText;
    btn.style.background = "";
  }, 2000);
};

/* UI RENDERING & REVEALS */
function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  header.innerHTML = `<header class="site-header"><div class="container header-inner"><a href="index.html" class="logo">Opalwave</a><nav class="nav"><a href="index.html">Home</a><a href="shop.html">Collections</a><a href="bag.html">Bag <span style="color:var(--accent)">[${count}]</span></a></nav></div></header>`;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `<footer class="container" style="padding: 6rem 0; border-top: 1px solid var(--border); margin-top: 8rem;"><p style="font-size: 0.6rem; letter-spacing: 0.2em; color: var(--text-muted);">© 2026 OPALWAVE ARCHIVE.</p></footer>`;
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.
