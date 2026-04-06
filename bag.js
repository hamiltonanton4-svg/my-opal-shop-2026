/* --- OPALWAVE BAG ENGINE 2026 --- */
import products from './js/products.js';

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
        listContainer.innerHTML = `
            <div style="padding: 6rem 0; border: 1px dashed var(--border); text-align: center; background: rgba(255,255,255,0.01);">
                <p style="opacity: 0.3; letter-spacing: 2px; font-size: 0.7rem; margin-bottom: 2rem;">YOUR ARCHIVE IS CURRENTLY EMPTY.</p>
                <a href="index.html" class="text-link" style="font-size: 0.8rem; font-weight: 900; text-decoration: none; color: white;">RETURN TO COLLECTION →</a>
            </div>`;
        if (subtotalEl) subtotalEl.innerText = "$0.00";
        if (totalEl) totalEl.innerText = "$0.00";
        return;
    }

    listContainer.innerHTML = cart.map((item, index) => `
        <div class="bag-card" style="display: flex; gap: 2.5rem; padding: 2.5rem; border: 1px solid var(--border); margin-bottom: 1.5rem; background: rgba(255,255,255,0.02); align-items: center;">
            <div style="width: 130px; height: 160px; overflow: hidden; border: 1px solid var(--border);">
                <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3 style="font-weight: 900; text-transform: uppercase; font-size: 1.1rem; letter-spacing: -0.02em; margin-bottom: 0.5rem;">${item.name}</h3>
                        <p style="font-size: 0.65rem; opacity: 0.4; text-transform: uppercase; letter-spacing: 1.5px;">SIZE: ${item.selectedSize}</p>
                    </div>
                    <p style="font-weight: 900; font-size: 1.1rem;">$${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
                
                <div style="margin-top: 2.5rem;">
                    <button class="remove-btn" data-index="${index}" style="background: none; border: none; color: #ff3333; font-size: 0.6rem; text-transform: uppercase; cursor: pointer; letter-spacing: 2px; padding: 0; font-weight: 700; opacity: 0.7;">
                        [ REMOVE FROM ARCHIVE ]
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    const totalValue = cart.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    if (subtotalEl) subtotalEl.innerText = `$${totalValue.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${totalValue.toFixed(2)}`;

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.currentTarget.dataset.index;
            removeFromBag(idx);
        });
    });
}

function removeFromBag(index) {
    let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    cart.splice(index, 1);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderBag(); 
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
        if (cart.length === 0) return;

        checkoutBtn.innerText = "OPENING SECURE SESSION...";
        checkoutBtn.disabled = true;

        // --- LIVE KEY INJECTED ---
        const stripe = Stripe('pk_live_51T5VLIQTBolXed9akrMjf3yYGLKGwt8pvMQcB7NontbKSIspqwNghUeRaa1kjq11AuhVTtJzBIDZV5vkDJ2E1swg00xDAl0kmY'); 

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
            console.error("Stripe Redirect Error:", error);
            alert(error.message);
            checkoutBtn.innerText = "PROCEED TO CHECKOUT";
            checkoutBtn.disabled = false;
        }
    });
}
