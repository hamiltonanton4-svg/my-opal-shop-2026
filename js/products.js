/* --- OPALWAVE SINGLE PRODUCT ENGINE --- */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the Product ID from the URL (e.g., product.html?id=ow-havoc-grey)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html'; // Redirect if no ID found
        return;
    }

    // 2. Find the product in our master list
    const product = window.products.find(p => p.id === productId);

    if (product) {
        renderProductDetails(product);
    } else {
        document.body.innerHTML = "<h1>Product Not Found</h1><a href='index.html'>Return Home</a>";
    }
});

function renderProductDetails(product) {
    // Fill in the Image
    const imgElement = document.getElementById("product-image");
    if (imgElement) imgElement.src = product.image;

    // Fill in the Text Details
    const nameElement = document.getElementById("product-name");
    const priceElement = document.getElementById("product-price");
    const descElement = document.getElementById("product-desc");

    if (nameElement) nameElement.innerText = product.name;
    if (priceElement) priceElement.innerText = `$${product.price.toFixed(2)}`;
    
    // Fill in Size Options
    const sizeContainer = document.getElementById("size-options");
    if (sizeContainer && product.options) {
        sizeContainer.innerHTML = product.options.map(size => `
            <button class="size-btn" onclick="selectSize(this)">${size}</button>
        `).join("");
    }
}

// Simple size selection toggle
function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
