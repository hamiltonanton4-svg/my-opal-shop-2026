import products from './products.js';

const CART_STORAGE_KEY = "opalwave_cart";

document.addEventListener("DOMContentLoaded", () => {
    renderBag();
    initCheckout();
});

function renderBag() {
    const listContainer = document.getElementById("bag-items-list");
    const subtotalEl = document.getElementById("bag-subtotal");
    const totalEl = document.getElementById("bag-total-amount");
    
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = `<p style="padding: 4rem 0; opacity: 0.5;">YOUR ARCHIVE IS EMPTY.</p>`;
        if (subtotalEl) subtotalEl.innerText = "$0.00";
        if (totalEl) totalEl.innerText = "$0.00";
        return;
    }

    // 1. Render items and clear "Authenticating" message
    listContainer.innerHTML = cart.map((item, index) => `
        <div class="bag-card" style="display: flex; gap: 2rem; padding: 2rem; border: 1px solid var(--border); margin-bottom: 1.5rem; background: rgba(255,255,255,0.02);">
            <img src="${item.image}" style="width: 100px; height: 130px; object-fit: cover;">
            <div style="flex: 1;">
                <h3 style="font-weight: 900; text-transform: uppercase;">${item.name}</h3>
                <p style="font-size: 0.7rem; opacity: 0.5;">SIZE: ${item.selectedSize}</p>
                <p style="font-weight: 900; margin-top: 1rem;">$${(Number(item.price) * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer; font-size:0.6rem; margin-top:1rem; padding:0;">[ REMOVE ]</button>
            </div>
        </div>
    `).join("");

    // 2. THE MATH FIX: Calculate totals
    const totalValue = cart.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    if (subtotalEl) subtotalEl.innerText = `$${totalValue.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${totalValue.toFixed(2)}`;

    // 3. Remove Button Logic
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.closest('button').dataset.index;
            let tempCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
            tempCart.splice(idx, 1);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tempCart));
            renderBag();
        });
    });
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
        if (cart.length === 0) return;

        checkoutBtn.innerText = "REDIRECTING...";
        
        // This is where Stripe does its own calculation based on your Dashboard prices
        const stripe = Stripe('pk_test_your_key_here'); // REPLACEME

        const lineItems = cart.map(item => ({
            price: item.stripePriceId,
            quantity: item.quantity
        }));

        const { error } = await stripe.redirectToCheckout({
            lineItems: lineItems,
            mode: 'payment',
            successUrl: window.location.origin + '/success.html',
            cancelUrl: window.location.origin + '/bag.html',
        });

        if (error) {
            alert(error.message);
            checkoutBtn.innerText = "PROCEED TO CHECKOUT";
        }
    });
}
