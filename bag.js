/* --- OPALWAVE BAG ENGINE 2026 --- */
import products from './products.js';

const CART_STORAGE_KEY = "opalwave_cart";

document.addEventListener("DOMContentLoaded", () => {
    renderBag();
});

function renderBag() {
    const listContainer = document.getElementById("bag-items-list");
    const subtotalEl = document.getElementById("bag-subtotal");
    const totalEl = document.getElementById("bag-total-amount");
    
    // 1. Pull data
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    if (!listContainer) return;

    // 2. Handle Empty State
    if (cart.length === 0) {
        listContainer.innerHTML = `
            <div style="padding: 4rem 0; border: 1px dashed var(--border); text-align: center;">
                <p style="opacity: 0.5; margin-bottom: 2rem;">YOUR ARCHIVE IS CURRENTLY EMPTY.</p>
                <a href="index.html" class="text-link">GO TO COLLECTION →</a>
            </div>`;
        if (subtotalEl) subtotalEl.innerText = "$0.00";
        if (totalEl) totalEl.innerText = "$0.00";
        return;
    }

    // 3. Render Items
    listContainer.innerHTML = cart.map((item, index) => `
        <div class="bag-card" style="display: flex; gap: 2rem; padding: 2rem; border: 1px solid var(--border); margin-bottom: 1.5rem; background: rgba(255,255,255,0.01);">
            <img src="${item.image}" style="width: 120px; height: 150px; object-fit: cover; border: 1px solid var(--border);">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h3 style="font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;">${item.name}</h3>
                        <p style="font-size: 0.7rem; opacity: 0.5; margin-top: 0.5rem;">SIZE: ${item.selectedSize}</p>
                    </div>
                    <p style="font-weight: 900;">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <div style="margin-top: 2rem;">
                    <button class="remove-btn" data-index="${index}" style="background: none; border: none; color: #ff4444; font-size: 0.6rem; text-transform: uppercase; cursor: pointer; letter-spacing: 1px; padding: 0;">
                        [ Remove Piece ]
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    // 4. CALCULATE SUMMARY (The Fix)
    const totalValue = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    
    if (subtotalEl) subtotalEl.innerText = `$${totalValue.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${totalValue.toFixed(2)}`;

    // 5. Attach Listeners to Remove Buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeFromBag(index);
        });
    });
}

function removeFromBag(index) {
    let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    cart.splice(index, 1);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderBag(); // Re-render everything including totals
}

// --- STRIPE REDIRECT ---
async function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (cart.length === 0) return;

    const btn = document.getElementById('checkout-btn');
    btn.innerText = "REDIRECTING...";
    
    const lineItems = cart.map(item => ({
        price: item.stripePriceId,
        quantity: item.quantity
    }));

    const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Enter your key here

    const { error } = await stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: 'payment',
        successUrl: window.location.origin + '/success.html',
        cancelUrl: window.location.origin + '/bag.html',
    });

    if (error) {
        alert(error.message);
        btn.innerText = "PROCEED TO CHECKOUT";
    }
}

// Checkout listener
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
}
