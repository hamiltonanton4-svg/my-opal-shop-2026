/* --- OPALWAVE BAG ENGINE 2026 --- */

// REDEFINE THIS HERE so the script doesn't break
const CART_STORAGE_KEY = "opalwave_cart";

document.addEventListener("DOMContentLoaded", () => {
  renderBag();
});

function renderBag() {
  const bagContainer = document.getElementById("bag-items-list");
  if (!bagContainer) return;

  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  // 1. If the bag is empty
  if (cart.length === 0) {
    bagContainer.innerHTML = `
      <div style="padding: 4rem 0;">
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Your archive is currently empty.</p>
        <a href="shop.html" class="btn-primary" style="text-decoration:none;">Explore Collections</a>
      </div>
    `;
    return;
  }

  // 2. Build the list
  let total = 0;
  const itemsHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="bag-item" style="display: flex; justify-content: space-between; align-items: center; padding: 2rem 0; border-bottom: 1px solid var(--border);">
        <div class="bag-item-info" style="display: flex; gap: 2rem; align-items: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border: 1px solid var(--border);">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800;">${item.name}</h3>
            <p style="font-size: 0.7rem; color: var(--accent); text-transform: uppercase;">Series: ${item.category}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">Qty: ${item.quantity}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 700;">$${itemTotal.toLocaleString()}</p>
          <button onclick="removeFromBag('${item.id}')" style="background: none; border: none; color: #ff4d4d; font-size: 0.6rem; font-weight: 900; cursor: pointer; margin-top: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">
            [ Remove ]
          </button>
        </div>
      </div>
    `;
  }).join("");

  // 3. Render items and summary
  bagContainer.innerHTML = `
    <div class="bag-grid">
      ${itemsHTML}
    </div>
    
    <div class="bag-summary" style="margin-top: 4rem; padding: 3rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); text-align: right;">
      <p class="bag-total-label" style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.2em;">Total Investment</p>
      <h2 class="bag-total-price" style="font-size: 3rem; font-weight: 900; margin: 0.5rem 0 2rem 0;">$${total.toLocaleString()}</h2>
      <button class="btn-primary" style="width: 100%;" onclick="alert('Proceeding to Secure Checkout...')">
        Secure Checkout
      </button>
    </div>
  `;
}

// Global Remove Function
window.removeFromBag = function(id) {
  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  cart = cart.filter(item => item.id != id);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  
  renderBag();
  // Call renderHeader from app.js to update the [count]
  if (typeof renderHeader === "function") renderHeader();
};
