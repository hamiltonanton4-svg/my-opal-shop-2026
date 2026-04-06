/* --- OPALWAVE PRODUCT PAGE BUILDER [GALLERY ENABLED] --- */
import products from './products.js'; 

let selectedSize = null;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const detailContainer = document.getElementById("product-detail");

    if (!productId || !products || !detailContainer) return;

    const product = products.find(p => p.id === productId);

    if (product) {
        const desc = product.description || "Premium heavyweight construction. Engineered for the OPALWAVE ARCHIVE series. Limited run.";
        const sizes = product.options || ["S", "M", "L", "XL"];
        
        // Gallery Check
        const hasBackView = product.backImage ? true : false;

        detailContainer.innerHTML = `
            <div class="product-single-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 5rem; padding: 12rem 0 6rem 0;">
                
                <div class="gallery-column">
                    <div class="product-image-wrap" style="aspect-ratio: 4/5; background: #0a0a0b; border: 1px solid var(--border); overflow: hidden;">
                        <img id="main-viewport" src="${product.image}" alt="${product.name}" 
                             style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;">
                    </div>
                    
                    ${hasBackView ? `
                    <div class="thumbnail-row" style="display: flex; gap: 12px; margin-top: 1.5rem;">
                        <img id="view-front" src="${product.image}" style="width: 70px; height: 90px; object-fit: cover; border: 1px solid var(--text); cursor: pointer; opacity: 1;">
                        <img id="view-back" src="${product.backImage}" style="width: 70px; height: 90px; object-fit: cover; border: 1px solid var(--border); cursor: pointer; opacity: 0.5;">
                    </div>
                    ` : ''}
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
                        ${desc}
                    </p>

                    <div class="selection-area" style="margin-bottom: 4rem;">
                        <p class="stat-chip" style="margin-bottom: 1.5rem; border: none; padding: 0; opacity: 0.5;">SELECT ARCHIVE SIZE</p>
                        <div id="size-options" style="display: flex; gap: 12px;">
                            ${sizes.map(size => `
                                <button class="size-btn" data-size="${size}">${size}</button>
                            `).join('')}
                        </div>
                    </div>

                    <button id="add-to-bag-btn" class="btn-primary" style="width: 100%;">
                        ADD TO ARCHIVE BAG
                    </button>
                    
                    <div style="margin-top: 2rem;">
                        <a href="index.html" class="text-link">← Back to Collection</a>
                    </div>
                </div>
            </div>
        `;

        // 1. GALLERY EVENT LISTENERS
        if (hasBackView) {
            const viewport = document.getElementById('main-viewport');
            const frontBtn = document.getElementById('view-front');
            const backBtn = document.getElementById('view-back');

            frontBtn.addEventListener('click', () => {
                viewport.src = product.image;
                frontBtn.style.borderColor = 'var(--text)';
                frontBtn.style.opacity = '1';
                backBtn.style.borderColor = 'var(--border)';
                backBtn.style.opacity = '0.5';
            });

            backBtn.addEventListener('click', () => {
                viewport.src = product.backImage;
                backBtn.style.borderColor = 'var(--text)';
                backBtn.style.opacity = '1';
                frontBtn.style.borderColor = 'var(--border)';
                frontBtn.style.opacity = '0.5';
            });
        }

        // 2. SIZE SELECTION LISTENERS
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => setProductSize(btn, btn.dataset.size));
        });

        // 3. BAG LISTENER
        document.getElementById('add-to-bag-btn').addEventListener('click', () => {
            handleAddToBag(product);
        });

    } else {
        detailContainer.innerHTML = `<div style="text-align:center; padding:10rem 0;"><h1>404. PIECE NOT FOUND</h1><a href="index.html" class="btn-primary">BACK</a></div>`;
    }
});

function setProductSize(btn, size) {
    document.querySelectorAll('.size-btn').forEach(b => {
        b.style.background = "transparent";
        b.style.color = "var(--text)";
        b.style.borderColor = "var(--border)";
    });
    btn.style.background = "var(--accent)";
    btn.style.color = "#fff";
    btn.style.borderColor = "var(--accent)";
    selectedSize = size;
}

function handleAddToBag(product) {
    if (!selectedSize) {
        alert("PLEASE SELECT A SIZE");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");

    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stripePriceId: product.stripePriceId,
        selectedSize: selectedSize,
        quantity: 1
    };

    const existing = cart.findIndex(i => i.id === product.id && i.selectedSize === selectedSize);
    if (existing > -1) {
        cart[existing].quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    const btn = document.getElementById('add-to-bag-btn');
    btn.innerHTML = "ADDED TO BAG ✓";
    btn.style.background = "#22c55e"; 
    
    setTimeout(() => {
        btn.innerHTML = "ADD TO ARCHIVE BAG";
        btn.style.background = ""; 
    }, 2000);
}
