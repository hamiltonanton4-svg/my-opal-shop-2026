/* --- OPALWAVE BAG ENGINE 2026 --- */

// 1. Setup - Using the exact same key as app.js
const BAG_STORAGE_KEY = "opalwave_cart";

// 2. Currency Formatter (Self-contained)
const formatMoney = (v) => new Intl.NumberFormat("en-US", { 
  style: "currency", currency: "USD", minimumFractionDigits: 0 
}).format(v || 0);

document.addEventListener("DOMContentLoaded", () => {
  renderBag();
});

function renderBag() {
  const container = document.getElementById("bag-items-list");
  if (!container) return;

  // Grab data from the browser
  const rawData = localStorage.getItem(BAG_STORAGE_KEY);
  const cart = JSON.parse(rawData || "[]");

  // State A: Empty Bag
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="padding: 4rem 0; text-align: left;">
        <p style="color: var(--text-muted); margin-bottom: 2.5rem; letter-spacing: 0.1em;">YOUR ARCHIVE IS CURRENTLY EMPTY.</p>
        <a href="shop.html" class="btn-primary" style="text-decoration: none; display: inline-block;">EXPLORE COLLECTIONS</a>
      </div>
    `;
    return;
  }

  // State B: Items in Bag
  let grandTotal = 0;
  
  const itemsHTML = cart.map(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    grandTotal += itemTotal;

    return `
      <div class="bag-item" style="display: flex; justify-content: space-between; align-items: center; padding: 2rem 0; border-bottom: 1px solid var(--border);">
        <div style="display: flex; gap: 2rem; align-items: center;">
          <img src="${item.image}" style="width: 120px; height: 140px; object-fit: cover; border: 1px solid var(--border);">
          <div>
            <h3 style="font-weight: 800; text-transform: uppercase; margin-bottom: 0.3rem;">${item.name}</h3>
            <p style="font-size: 0.6rem; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 0.5rem;">${item.category || 'ARCHIVE'}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted);">QTY: ${item.quantity}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 900; font-size: 1.2rem;">${formatMoney(itemTotal)}</p>
          <button onclick="removeFromBag('${item.id}')" style="background: none; border: none; color: #ff4d4d; font-size: 0.6rem; font-weight: 900; cursor: pointer; margin-top: 1rem; text-transform: uppercase; letter-spacing: 0.2em;">
            [ REMOVE ]
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Inject the final HTML
  container.innerHTML = `
    <div class="bag-grid-layout">
      ${itemsHTML}
      <div class="bag-summary" style="margin-top: 5rem; padding: 4rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); text-align: right;">
        <p style="font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.3em; margin-bottom: 1rem;">TOTAL INVESTMENT</p>
        <h2 style="font-size: 4rem; font-weight: 900; margin-bottom: 3rem;">${formatMoney(grandTotal)}</h2>
        <button class="btn-primary" style="width: 100%; padding: 1.5rem;" onclick="alert('SECURE CHECKOUT INITIALIZING...')">
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  `;
}

// Remove Logic
window.removeFromBag = function(id) {
  let cart = JSON.parse(localStorage.getItem(BAG_STORAGE_KEY) || "[]");
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(cart));
  
  // Re-run the render functions
  renderBag();
  // Call app.js header update if it exists
  if (typeof renderHeader === "function") renderHeader();
};
