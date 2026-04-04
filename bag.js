/* --- OPALWAVE BAG ENGINE --- */

document.addEventListener("DOMContentLoaded", () => {
    renderBag();
});

function renderBag() {
    const listContainer = document.getElementById("bag-items-list");
    const subtotalEl = document.getElementById("bag-subtotal");
    const totalEl = document.getElementById("bag-total");
    
    // 1. Get the items from memory
    const cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");

    if (cart.length === 0) {
        listContainer.innerHTML = `
            <div style="padding: 4rem 0; text-align: center; border: 1px dashed var(--border);">
                <p style="opacity: 0.5; margin-bottom: 2rem;">Your archive is currently empty.</p>
                <a href="index.html" class="text-link">Return to Collection →</a>
            </div>`;
        return;
    }

    // 2. Build the HTML for the list
    listContainer.innerHTML = cart.map((item, index) => `
        <div class="bag-item" style="display: flex; gap: 2rem; padding: 2rem 0; border-bottom: 1px solid var(--border); align-items: center;">
            <img src="${item.image}" style="width: 100px; height: 100px; object-fit: cover; background: #000;">
            <div style="flex-grow: 1;">
                <h4 style="text-transform: uppercase; margin-bottom: 0.5rem;">${item.name}</h4>
                <p style="opacity: 0.5; font-size: 0.8rem;">Series: ${item.category}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromBag(${index})" style="background:none; border:none; color: #ff4444; font-size: 0.7rem; cursor:pointer; margin-top: 1rem; text-transform: uppercase;">Remove</button>
            </div>
        </div>
    `).join("");

    // 3. Calculate Totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.innerText = `$${total.toFixed(2)}`;
    totalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromBag(index) {
    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    cart.splice(index, 1); // Delete that specific item
    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    // Refresh page and header count
    renderBag();
    if (typeof renderHeader === "function") renderHeader();
}
