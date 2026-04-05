/* --- OPALWAVE BAG ENGINE --- */

document.addEventListener("DOMContentLoaded", () => {
    renderBag();
});

function renderBag() {
    const listContainer = document.getElementById("bag-items-list");
    const subtotalEl = document.getElementById("bag-subtotal");
    const totalEl = document.getElementById("bag-total-amount"); // Matches your HTML exactly
    
    const cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");

    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = `
            <div style="padding: 4rem 0; text-align: center; border: 1px dashed var(--border);">
                <p style="opacity: 0.5; margin-bottom: 2rem;">Your archive is currently empty.</p>
                <a href="index.html" class="text-link">Return to Collection →</a>
            </div>`;
        if (subtotalEl) subtotalEl.innerText = "$0.00";
        if (totalEl) totalEl.innerText = "$0.00";
        return;
    }

    // 2. Build the HTML for the list
    listContainer.innerHTML = cart.map((item, index) => `
        <div class="bag-item" style="display: flex; gap: 2rem; padding: 2rem 0; border-bottom: 1px solid var(--border); align-items: center;">
            <img src="${item.image}" style="width: 100px; height: 100px; object-fit: cover; background: #000; border: 1px solid var(--border);">
            <div style="flex-grow: 1;">
                <h4 style="text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 900;">${item.name}</h4>
                <p style="opacity: 0.5; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">SIZE: ${item.selectedSize || 'N/A'}</p>
                <p style="opacity: 0.3; font-size: 0.7rem;">Series: ${item.category}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-weight: 700; font-size: 1.1rem;">$${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromBag(${index})" style="background:none; border:none; color: #ff4444; font-size: 0.7rem; cursor:pointer; margin-top: 1rem; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Remove</button>
            </div>
        </div>
    `).join("");

    // 3. Calculate Totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.innerText = `$${total.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromBag(index) {
    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    renderBag();
    if (typeof renderHeader === "function") renderHeader();
}

/** * 4. STRIPE CHECKOUT INTEGRATION 
 */
async function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    
    if (cart.length === 0) {
        alert("Your bag is empty.");
        return;
    }

    // Initialize Stripe using the key from products.js
    const stripe = Stripe(window.stripeKey);

    const lineItems = cart.map(item => {
        const productData = window.products.find(p => p.id === item.id);
        
        if (!productData || !productData.stripePriceId || productData.stripePriceId.includes("PASTE")) {
            console.error(`Missing Stripe Price ID for ${item.name}`);
            return null;
        }

        return {
            price: productData.stripePriceId,
            quantity: item.quantity
        };
    }).filter(item => item !== null);

    if (lineItems.length === 0) {
        alert("Checkout Error: Missing product configurations. Check console.");
        return;
    }

    const { error } = await stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: 'payment',
        successUrl: window.location.origin + '/success.html',
        cancelUrl: window.location.origin + '/bag.html',
    });

    if (error) {
        console.error("Stripe Error:", error.message);
        alert("Stripe Error: " + error.message);
    }
}
