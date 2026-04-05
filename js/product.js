/* --- OPALWAVE PRODUCT PAGE BUILDER --- */

// Track selection for the bag
let selectedSize = null;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const detailContainer = document.getElementById("product-detail");

    // Ensure we have data and a place to put it
    if (!productId || !window.products || !detailContainer) return;

    const product = window.products.find(p => p.id === productId);

    if (product) {
        // Build the Page using your Branding Classes
        detailContainer.innerHTML = `
            <div class="product-single-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 5rem; padding: 12rem 0 6rem 0;">
                
                <div class="product-image-wrap" style="aspect-ratio: 4/5; background: #0a0a0b; border: 1px solid var(--border);">
                    <img id="product-image" src="${product.image}" alt="${product.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(0%); opacity: 1;">
                </div>

                <div class="product-info-container">
                    <span class="pill">${product.category}</span>
                    <h1 style="font-size: 3.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.04em; margin-bottom: 1.5rem; text-transform: uppercase;">
                        ${product.name}
                    </h1>
                    
                    <p style="font-size: 1.8rem; font-weight: 700; color: var(--text); margin-bottom: 2rem;">
                        $${product.price.toFixed(2)}
                    </p>
                    
                    <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.8; margin-bottom: 3rem; max-width: 480px; border-left: 1px solid var(--accent); padding-left: 1.5rem;">
                        ${product.description}
                    </p>

                    <div class="selection-area" style="margin-bottom: 4rem;">
                        <p class="stat-chip" style="margin-bottom: 1.5rem; border: none; padding: 0; opacity: 0.5;">SELECT ARCHIVE SIZE</p>
                        <div id="size-options" style="display: flex; gap: 12px;">
                            ${product.options.map(size => `
                                <button class="size-btn" onclick="setProductSize(this, '${size}')">${size}</button>
                            `).join('')}
                        </div>
                    </div>

                    <button class="btn-primary" style="width: 100%;" onclick="handleAddToBag('${product.id}')">
                        ADD TO ARCHIVE BAG
                    </button>
                    
                    <div style="margin-top: 2rem;">
                        <a href="index.html" class="text-link">← Back to Collection</a>
                    </div>
                </div>
            </div>
        `;
    } else {
        detailContainer.innerHTML = `<div class="hero"><h1>404. ITEM NOT FOUND</h1><a href="index.html" class="btn-primary">RETURN</a></div>`;
    }
});

/**
 * Handle Size Clicks
 */
function setProductSize(btn, size) {
    document.querySelectorAll('.size-btn').forEach(b => {
        b.style.background = "transparent";
        b.style.color = "var(--text)";
        b.style.borderColor = "var(--border)";
    });
    
    // Apply Active State (Matches your Brand Accent)
    btn.style.background = "var(--accent)";
    btn.style.color = "#fff";
    btn.style.borderColor = "var(--accent)";
    
    selectedSize = size;
}

/**
 * Handle Bag Logic
 */
function handleAddToBag(id) {
    if (!selectedSize) {
        alert("PLEASE SELECT A SIZE");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    const product = window.products.find(p => p.id === id);

    const cartItem = {
        ...product,
        selectedSize: selectedSize,
        quantity: 1
    };

    // Prevent duplicates of same size
    const existing = cart.findIndex(i => i.id === id && i.selectedSize === selectedSize);
    if (existing > -1) {
        cart[existing].quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    // Quick success animation/feedback
    const btn = document.querySelector('.btn-primary');
    btn.innerHTML = "ADDED TO BAG ✓";
    btn.style.background = "#22c55e"; // Success Green
    
    setTimeout(() => {
        btn.innerHTML = "ADD TO ARCHIVE BAG";
        btn.style.background = "#fff";
    }, 2000);
}
