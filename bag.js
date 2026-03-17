/* --- OPALWAVE BAG ENGINE 2026 --- */
const CART_STORAGE_KEY = "opalwave_cart"; 

function renderBag() {
  const container = document.getElementById("bag-items-list");
  if (!container) return;
  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted)">Archive empty.</p><a href="shop.html" class="btn-primary">Shop</a>`;
    return;
  }

  let total = 0;
  const itemsHTML = cart.map(item => {
    total += (item.price * item.quantity);
    return `
      <div class="bag-item">
        <div class="bag-item-info">
          <img src="${item.image}" class="bag-item-img">
          <div><h3>${item.name}</h3><p>Qty: ${item.quantity}</p></div>
        </div>
        <div style="text-align:right">
          <p>$${(item.price * item.quantity).toLocaleString()}</p>
          <button onclick="removeFromBag('${item.id}')" style="color:red; background:none; border:none; cursor:pointer;">[Remove]</button>
        </div>
      </div>`;
  }).join("");

  container.innerHTML = `
    <div class="bag-grid">${itemsHTML}</div>
    <div class="bag-summary">
      <p>TOTAL INVESTMENT</p>
      <h2 style="font-size:3rem">$${total.toLocaleString()}</h2>
      <button class="btn-primary" style="width:100%">Secure Checkout</button>
    </div>`;
}

window.removeFromBag = function(id) {
  let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]").filter(i => i.id != id);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderBag();
  renderHeader();
};

document.addEventListener("DOMContentLoaded", renderBag);
