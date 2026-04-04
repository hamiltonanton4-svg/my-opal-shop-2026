/* --- OPALWAVE MASTER ENGINE 2026 --- */
const PRODUCT_STORAGE_KEY = "opalwave_vault_inventory";
const CART_STORAGE_KEY = "opalwave_cart";

// Currency Formatter
const money = (v) => new Intl.NumberFormat("en-US", { 
  style: "currency", 
  currency: "USD", 
  minimumFractionDigits: 2 
}).format(v || 0);

// Get products from storage or the window object
function getProducts() {
  const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
  // This ensures it prioritizes your hardcoded products.js list
  return stored ? JSON.parse(stored) : (window.products || []);
}

/* --- CART CORE LOGIC --- */
window.addToCart = function(id) {
  const allProducts = getProducts();
  const p = allProducts.find(item => item.id == id);
  if(!p) return;

  const sizeSelector = document.getElementById(`size-select-${id}`);
  const selectedSize = sizeSelector ? sizeSelector.value : "OS"; 

  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const cartItemId = `${id}-${selectedSize}`;
  const existing = cart.find(i => i.cartId === cartItemId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...p, cartId: cartItemId, selectedSize, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderHeader();
  
  // Button Feedback
  const btn = event.target;
  const oldText = btn.innerText;
  btn.innerText = `ADDED [${selectedSize}]`;
  btn.classList.add('btn-active');
  
  setTimeout(() => {
    btn.innerText = oldText;
    btn.classList.remove('btn-active');
  }, 2000);
};

/* --- UI RENDERING --- */
function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  header.innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo">Opalwave</a>
      <nav class="nav">
        <a href="index.html">Home</a>
        <a href="shop.html">Archive</a>
        <a href="bag.html" class="bag-link">Bag <span class="bag-count">[${count}]</span></a>
      </nav>
    </div>`;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <p class="copyright">© 2026 OPALWAVE ARCHIVE. ALL RIGHTS RESERVED.</p>
      </div>
    </div>`;
}

/* --- ANIMATION ENGINE --- */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

/* --- INITIALIZATION --- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  
  // Checks for BOTH possible grid IDs (Homepage vs Shop page)
  const grid = document.getElementById("featured-products") || document.getElementById("product-grid");
  
  if (grid) {
    const products = getProducts();
    
    if (products.length === 0) {
      grid.innerHTML = `<p class="empty-msg">THE ARCHIVE IS CURRENTLY EMPTY.</p>`;
    } else {
      grid.innerHTML = products.map(p => `
        <div class="product-card reveal">
          <div class="image-wrap" style="position:relative; overflow:hidden; aspect-ratio:1/1;">
            <img src="${p.image}" alt="${p.name}" class="main-img" style="width:100%; transition: opacity 0.3s;">
            ${p.hoverImage ? `<img src="${p.hoverImage}" class="hover-img" style="position:absolute; top:0; left:0; width:100%; opacity:0; transition: opacity 0.3s;">` : ''}
          </div>
          <div class="product-info">
            <span class="category">${p.category || 'Archive'}</span>
            <h3>${p.name}</h3>
            <p class="price">${money(p.price)}</p>
            
            <div class="actions">
              <select id="size-select-${p.id}" class="variant-select">
                ${(p.options || ["S", "M", "L", "XL"]).map(opt => 
                  `<option value="${opt}">${opt}</option>`
                ).join('')}
              </select>
              <button class="add-btn" onclick="addToCart('${p.id}')">Add to Archive</button>
            </div>
          </div>
        </div>
      `).join("");

      // Re-trigger reveal animations for the new elements
      setTimeout(initReveal, 100);
    }
  }
});
  setTimeout(initReveal, 100);
});
