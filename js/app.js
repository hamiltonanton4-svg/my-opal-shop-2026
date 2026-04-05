/* --- OPALWAVE MASTER ENGINE 2026 --- */
const CART_STORAGE_KEY = "opalwave_cart";

// Format numbers to USD Currency - Removed manual $ to prevent double symbols
const money = (v) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD" 
}).format(v || 0);

/* --- UI COMPONENT: HEADER --- */
function renderHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Using a semantic <header> tag for better SEO/Structure
    header.innerHTML = `
    <header class="site-header">
        <div class="container header-inner">
            <a href="index.html" class="logo">Opalwave</a>
            <nav class="nav">
                <a href="index.html">Home</a>
                <a href="shop.html">Archive</a>
                <a href="bag.html" class="bag-link">Bag [${count}]</a>
            </nav>
        </div>
    </header>`;
}

/* --- UI COMPONENT: FOOTER --- */
function renderFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.innerHTML = `
    <div class="container" style="padding: 6rem 0; border-top: 1px solid var(--border); margin-top: 5rem; text-align: center;">
        <p style="font-size: 0.6rem; opacity: 0.4; letter-spacing: 0.3em; text-transform: uppercase;">
            © 2026 OPALWAVE ARCHIVE. DIGITAL LUXURY. PHYSICAL FORM.
        </p>
    </div>`;
}

/* --- PRODUCT GRID ENGINE --- */
function initProducts() {
    const grid = document.getElementById("featured-products") || document.getElementById("product-grid");
    if (!grid) return;

    let items = window.products || [];

    // URL Filtering Logic
    const urlParams = new URLSearchParams(window.location.search);
    const catFilter = urlParams.get('category');
    
    if (catFilter) {
        items = items.filter(p => p.category.toUpperCase() === catFilter.toUpperCase());
    }

    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.5; padding: 10rem 0; letter-spacing: 2px;">NO ITEMS FOUND IN THIS SERIES.</p>`;
        return;
    }

    // Map through items - Note: money(p.price) handles the $ sign
    grid.innerHTML = items.map(p => `
        <div class="product-card reveal">
            <div class="product-image-wrap" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer;">
                <img src="${p.image}" alt="${p.name}" class="main-img">
            </div>
            <div class="product-info" style="margin-top: 1.5rem;">
                <span class="pill" style="font-size: 0.6rem; margin-bottom: 0.5rem; display:inline-block;">${p.category}</span>
                <div class="product-title" style="font-weight:900; text-transform:uppercase; letter-spacing:0.05em; font-size: 0.9rem;">${p.name}</div>
                <p class="price" style="opacity:0.6; margin-top:0.5rem; font-weight: 700;">${money(p.price)}</p>
                
                <button class="btn-primary" style="width:100%; padding: 1rem; margin-top: 1.5rem; font-size: 0.7rem;" onclick="location.href='product.html?id=${p.id}'">
                    VIEW PIECE
                </button>
            </div>
        </div>
    `).join("");

    // Trigger reveal animations
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }, 150);
}

/* --- BOOT ENGINE --- */
document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initProducts();
});
