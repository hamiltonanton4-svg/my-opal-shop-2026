/* --- OPALWAVE SINGLE PRODUCT ENGINE --- */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the Product ID from the URL (e.g., product.html?id=ow-havoc-grey)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Safety Check: If no ID or master list, go back home
    if (!productId || !window.products) {
        console.error("Missing Product ID or Master List");
        // Optional: window.location.href = 'index.html'; 
        return;
    }

    // 3. Find the specific product in the window.products array
    const product = window.products.find(p => p.id === productId);

    if (product) {
        renderProductDetails(product);
    } else {
        console.error("Product not found in Archive.");
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.innerHTML = "<h2 style='text-align:center; margin-top:100px;'>ARCHIVE ITEM NOT FOUND</h2>";
    }
});

function renderProductDetails(product) {
    // Update Image
    const imgElement = document.getElementById("product-image");
    if (imgElement) {
        imgElement.src = product.image;
        imgElement.alt = product.name;
    }

    // Update Text Details
    const nameElement = document.getElementById("product-name");
    const priceElement = document.getElementById("product-price");

    if (nameElement) nameElement.innerText = product.name;
    if (priceElement) priceElement.innerText = `$${product.price.toFixed(2)}`;
    
    // Render Size Buttons
    const sizeContainer = document.getElementById("size-options");
    if (sizeContainer && product.options) {
        sizeContainer.innerHTML = product.options.map(size => `
            <button class="size-btn" onclick="selectSize(this)">${size}</button>
        `).join("");
    }
}

// Function to handle size button clicks
function selectSize(btn) {
    // Remove 'active' class from all buttons
    document.querySelectorAll('.size-btn').forEach(b => {
        b.style.background = "transparent";
        b.style.color = "var(--text)";
    });
    
    // Add 'active' styling to clicked button
    btn.style.background = "var(--text)";
    btn.style.color = "var(--bg)";
}
