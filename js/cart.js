document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("cart-items-list");
  if (!list) return;

  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const stripeCheckoutBtn = document.getElementById("stripeCheckoutBtn");

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_00000000000000";

  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      list.innerHTML = `<div class="empty-state">Your cart is empty. Add something amazing to get started.</div>`;
      subtotalEl.textContent = money(0);
      totalEl.textContent = money(0);
      return;
    }

    list.innerHTML = cart.map(item => `
      <div class="cart-item reveal">
        <img src="${item.image}" alt="${item.name}" />

        <div>
          <h3>${item.name}</h3>
          <p class="muted">${money(item.price)}</p>

          <div class="qty-controls">
            <button onclick="changeQty('${item.id}', -1)">-</button>
            <strong>${item.quantity}</strong>
            <button onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>

        <div>
          <p><strong>${money(item.price * item.quantity)}</strong></p>
          <button class="btn btn-danger" onclick="removeAndRefresh('${item.id}')">Remove</button>
        </div>
      </div>
    `).join("");

    const subtotal = cartSubtotal();
    subtotalEl.textContent = money(subtotal);
    totalEl.textContent = money(subtotal);
    initReveal();
  }

  window.changeQty = function(productId, amount) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    updateCartQuantity(productId, item.quantity + amount);
    renderCart();
  };

  window.removeAndRefresh = function(productId) {
    removeFromCart(productId);
    renderCart();
    showToast("Item removed from cart");
  };

  clearCartBtn.addEventListener("click", () => {
    clearCart();
    renderCart();
    showToast("Cart cleared");
  });

  stripeCheckoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }

    if (STRIPE_PAYMENT_LINK.includes("test_00000000000000")) {
      showToast("Add your real Stripe Payment Link in js/cart.js");
      return;
    }

    window.location.href = STRIPE_PAYMENT_LINK;
  });

  renderCart();
});