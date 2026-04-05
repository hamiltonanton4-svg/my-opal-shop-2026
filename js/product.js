/* --- OPALWAVE PRODUCT PAGE BUILDER --- */

// Track the user's size selection
let selectedSize = null;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const detailContainer = document.getElementById("product-detail");

    // Safety check: ensure we have an ID and the products list is loaded
    if (!productId || !window.products || !detailContainer) return;

    const product = window.products.find(p => p.id === productId);

    if (product) {
        // Build the Product Detail UI
        detailContainer.innerHTML = `
            <div class="product-single-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding-top: 100px;">
                
                <div class="product-image-container">
                    <img id="product-image" src="${product.image}" alt="${product.name}" 
                         style="width: 100%; border-radius: 4px; background: #000; transition: opacity 0.3s ease;">
                </div>

                <div class="product-info-container">
                    <span class="pill" style="margin-bottom: 1rem; display: inline-block;">${product.category}</span>
                    <h1 id="product-name" style="text-transform: uppercase; margin-bottom: 1rem; font-weight: 900;">${product.name}</h1>
                    <p id="product-price" style="font-size: 1.5rem; opacity: 0.8; margin-bottom: 1.5rem;">$${product.price.toFixed(2)}</p>
                    
                    <p id="product-description" style="opacity: 0.6; line-height: 1.6; margin-bottom: 2.5rem; max-width: 450px;">
                        ${product.description}
                    </p>

                    <div class="selection-area" style="margin-bottom: 3rem;">
                        <p style="font-size: 0.7rem; opacity: 0.5; margin-bottom: 1rem; letter-spacing: 1px;">SELECT SIZE</p>
                        <div id="size-options" style="display: flex; gap: 10px;">
                            ${product.options.map(size => `
                                <button class="size-btn" onclick="setProductSize(this, '${size}')">${size}</button>
                            `).join('')}
                        </div>
                    </div>

                    <button class="btn-primary" style="width: 100%; padding: 1.2rem; font-weight: 900; letter-spacing: 1px;" 
                            onclick="handleAddToBag('${product.id}')">
                        ADD TO BAG
                    </button>
                </div>
            </div>
        `;
    } else {
        detailContainer.innerHTML = `
            <div style="text-align: center; padding: 10rem 0;">
                <h2 style="margin-bottom: 2rem;">Product Archive Not Found.</h2>
                <a href="index.html" class="btn-primary">Return to Shop</a>
            </div>
        `;
    }
});

/**
 * Handles the visual selection of a size button
 */
function setProductSize(btn, size) {
    // Remove 'active' class from all size buttons
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    
    // Add 'active' class to the clicked button
    btn.classList.add('active');
    
    // Store the selection globally for this page
    selectedSize = size;
}

/**
 * Handles adding the specific item + size to local storage
 */
function handleAddToBag(id) {
    if (!selectedSize) {
        alert("Please select a size before adding to your bag.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    const product = window.products.find(p => p.id === id);

    // Check if the exact item AND size is already in the bag
    const existingIndex = cart.findIndex(item => item.id === id && item.selectedSize === selectedSize);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedSize: selectedSize,
            stripePriceId: product.stripePriceId,
            quantity: 1
        });
    }

    // Save back to storage
    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    // Optional: Refresh header bag count if you have a header.js
    if (window.renderHeader) renderHeader();

    alert(`${product.name} (Size: ${selectedSize}) added to bag.`);
}
