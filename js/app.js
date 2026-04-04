/* --- OPALWAVE MASTER ENGINE 2026 --- */
const CART_STORAGE_KEY = "opalwave_cart";

// Format numbers to USD Currency
const money = (v) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD" 
}).format(v || 0);

/* --- UI COMPONENT: HEADER --- */
function renderHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    // Calculate total items in bag from localStorage
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    header.innerHTML = `
    <div class="site-header">
        <div class="container header-inner">
            <a href="index.html" class="logo">Opalwave</a>
            <nav class="nav">
                <a href="index.html">Home</a>
                <a href="shop.html">Archive</a>
                <a href="bag.html" class="bag-link">Bag [${count}]</a>
            </nav>
        </div>
    </div>`;
}

/* --- UI COMPONENT: FOOTER --- */
function renderFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.innerHTML = `
    <div class="container" style="padding: 4rem 0; border-top: 1px solid var(--border); margin-top: 5rem;">
        <p style="font-size: 0.7rem; opacity: 0.5; letter-spacing: 0.2em;">© 2026 OPALWAVE ARCHIVE. DIGITAL LUXURY.</p>
    </div>`;
}

/* --- PRODUCT GRID ENGINE --- */
function initProducts() {
    // Looks for 'featured-products' (Home) or 'product-grid' (Shop)
    const grid = document.getElementById("featured-products") || document.getElementById("product-grid");
    if (!grid) return;

    // Get data from products.js
    let items = window.products || [];

    // URL Filtering Logic (for Category links)
    const urlParams = new URLSearchParams(window.location.search);
    const catFilter = urlParams.get('category');
    
    if (catFilter) {
        items = items.filter(p => p.category.toUpperCase() === catFilter.toUpperCase());
    }

    // If no items, show empty state
    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.5; padding: 5rem 0;">NO ITEMS FOUND IN THIS SERIES.</p>`;
        return;
    }

    // Map through items and inject HTML
    grid.innerHTML = items.map(p => `
        <div class="product-card reveal">
            <div class="product-image-wrap" style="position:relative; overflow:hidden; background: #0a0a0a;">
                <img src="${p.image}" alt="${p.name}" class="main-img" style="width:100%; display:block; aspect-ratio: 1/1; object-fit: cover;">
            </div>
            <div class="product-info" style="margin-top: 1.5rem;">
                <span class="pill" style="font-size: 0.6rem; margin-bottom: 0.5rem; display:inline-block;">${p.category}</span>
                <div class="product-title" style="font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">${p.name}</div>
                <p class="price" style="opacity:0.6; margin-top:0.5rem;">${money(p.price)}</p>
                <button class="btn-primary" style="width:100%; padding: 0.8rem; margin-top: 1rem; font-size: 0.7rem; cursor:pointer;" onclick="location.href='product.html?id=${p.id}'">
                    View Archive
                </button>
            </div>
        </div>
    `).join("");

    // Trigger reveal animations after a short delay
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }, 100);
}

/* --- BOOT ENGINE ON LOAD --- */
document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initProducts();
});
