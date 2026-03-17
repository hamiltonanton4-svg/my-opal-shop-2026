/* --- OPALWAVE BAG ENGINE 2026 --- */

document.addEventListener("DOMContentLoaded", () => {
  renderBag();
});

function renderBag() {
  const bagContainer = document.getElementById("bag-items-list");
  if (!bagContainer) return;

  const cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");

  // 1. If the bag is empty
  if (cart.length === 0) {
    bagContainer.innerHTML = `
      <div style="padding: 4rem 0;">
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Your archive is currently empty.</p>
        <a href="shop.html" class="btn-primary">Explore Collections</a>
      </div>
    `;
    return;
  }

  // 2. If there are items, build the list
  let total = 0;
  const itemsHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="bag-item">
        <div class="bag-item-info">
          <img src="${item.image}" alt="${item.name}" class="bag-item-img">
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

  // 3. Render the items and the summary
  bagContainer.innerHTML = `
    <div class="bag-grid">
      ${itemsHTML}
    </div>
    
    <div class="bag-summary">
      <p class="bag-total-label">Total Investment</p>
      <h2 class="bag-total-price">$${total.toLocaleString()}</h2>
      <button class="btn-primary" style="width: 100%;" onclick="alert('Checkout integration coming soon.')">
        Secure Checkout
      </button>
    </div>
  `;
}

// Global Remove Function
window.removeFromBag = function(id) {
  let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
  cart = cart.filter(item => item.id != id);
  localStorage.setItem("opalwave_cart", JSON.stringify(cart));
  
  // Refresh the page data
  renderBag();
  // Refresh the header count (from app.js)
  if (typeof renderHeader === "function") renderHeader();
};