/* --- OPALWAVE PRODUCT PAGE BUILDER --- */

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const detailContainer = document.getElementById("product-detail");

    if (!productId || !window.products || !detailContainer) return;

    const product = window.products.find(p => p.id === productId);

    if (product) {
        // Build the inner HTML from scratch
        detailContainer.innerHTML = `
            <div class="product-single-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding-top: 100px;">
                <div class="product-image-container">
                    <img id="product-image" src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 4px; background: #000;">
                </div>

                <div class="product-info-container">
                    <span class="pill" style="margin-bottom: 1rem; display: inline-block;">${product.category}</span>
                    <h1 id="product-name" style="text-transform: uppercase; margin-bottom: 1rem;">${product.name}</h1>
                    <p id="product-price" style="font-size: 1.5rem; opacity: 0.8; margin-bottom: 2rem;">$${product.price.toFixed(2)}</p>
                    
                    <div class="selection-area" style="margin-bottom: 3rem;">
                        <p style="font-size: 0.7rem; opacity: 0.5; margin-bottom: 1rem;">SELECT SIZE</p>
                        <div id="size-options" style="display: flex; gap: 10px;">
                            ${product.options.map(s => `<button class="size-btn" onclick="selectSize(this)">${s}</button>`).join('')}
                        </div>
                    </div>

                    <button class="btn-primary" style="width: 100%; padding: 1.2rem;" onclick="addToBag('${product.id}')">ADD TO BAG</button>
                </div>
            </div>
        `;
    } else {
        detailContainer.innerHTML = `<h2>Product not found.</h2><a href="index.html">Return to Archive</a>`;
    }
});

function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function addToBag(id) {
    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    const product = window.products.find(p => p.id === id);
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    // Refresh the header count
    if (typeof renderHeader === "function") renderHeader();
    
    alert(`${product.name} added to your bag.`);
}
