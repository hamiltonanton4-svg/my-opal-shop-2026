/* --- OPALWAVE BAG MASTER 2026 --- */
const STORAGE_KEY = "opalwave_cart";

window.onload = function() {
    const container = document.getElementById("bag-items-list");
    if (!container) return;

    // 1. Clear loading state
    container.innerHTML = "";

    const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    // 2. Empty State Logic
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="padding:100px 0; border-top:1px solid var(--border); animation: fadeIn 0.8s ease;">
                <p style="color:var(--text-muted); letter-spacing:0.2em;">YOUR ARCHIVE IS EMPTY.</p>
                <a href="shop.html" class="btn-primary" style="text-decoration:none; display:inline-block; margin-top:20px;">EXPLORE COLLECTIONS</a>
            </div>`;
        return;
    }

    // 3. Render Items
    let total = 0;
    const itemsHTML = cart.map(item => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        total += (price * qty);
        
        return `
            <div class="bag-item" style="display:flex; justify-content:space-between; padding:40px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; gap:30px; align-items:center;">
                    <img src="${item.image}" style="width:100px; height:130px; object-fit:cover; border:1px solid var(--border);">
                    <div>
                        <h3 style="font-weight:800; text-transform:uppercase;">${item.name}</h3>
                        <p style="font-size:0.7rem; color:var(--text-muted);">QTY: ${qty}</p>
                    </div>
                </div>
                <div style="text-align:right;">
                    <p style="font-weight:900; font-size:1.2rem;">$${(price * qty).toLocaleString()}</p>
                    <button onclick="removeItem('${item.id}')" style="background:none; border:none; color:red; cursor:pointer; font-size:0.6rem; margin-top:15px; font-weight:900;">[ REMOVE ]</button>
                </div>
            </div>`;
    }).join("");

    // 4. Inject Layout
    container.innerHTML = `
        <div class="bag-wrapper">
            ${itemsHTML}
            <div style="margin-top:80px; padding:50px; background:rgba(255,255,255,0.03); border:1px solid var(--border); text-align:right;">
                <p style="font-size:0.6rem; color:var(--text-muted); letter-spacing:0.3em;">TOTAL INVESTMENT</p>
                <h2 style="font-size:4rem; font-weight:900; margin:10px 0 40px 0;">$${total.toLocaleString()}</h2>
                <button id="checkout-btn" class="btn-primary" style="width:100%; padding:25px;" onclick="processCheckout()">SECURE CHECKOUT</button>
            </div>
        </div>`;
};

// 5. Functions
window.removeItem = function(id) {
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    location.reload(); 
};

window.processCheckout = async function() {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const btn = document.getElementById("checkout-btn");
    
    try {
        btn.innerText = "CONNECTING TO STRIPE...";
        btn.disabled = true;

        const response = await fetch('/.netlify/functions/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || "Checkout link failed");
        }
    } catch (err) {
        console.error("Archive Error:", err);
        alert("TERMINAL ERROR: " + err.message);
        btn.innerText = "SECURE CHECKOUT";
        btn.disabled = false;
    }
};
/* --- END OF FILE --- */
