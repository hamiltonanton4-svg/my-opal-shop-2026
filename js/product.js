document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId || !window.products) return;

    const product = window.products.find(p => p.id === productId);

    if (product) {
        document.getElementById("product-image").src = product.image;
        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-price").innerText = `$${product.price.toFixed(2)}`;
        
        const sizeBox = document.getElementById("size-options");
        sizeBox.innerHTML = product.options.map(s => `
            <button class="size-btn" onclick="selectSize(this)">${s}</button>
        `).join("");

        // UPDATE THE BUY BUTTON TO WORK
        const buyBtn = document.querySelector(".btn-primary");
        if (buyBtn) {
            buyBtn.onclick = () => addToBag(product.id);
        }
    }
});

function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function addToBag(id) {
    let cart = JSON.parse(localStorage.getItem("opalwave_cart") || "[]");
    const product = window.products.find(p => p.id === id);
    
    // Check if item is already in bag
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("opalwave_cart", JSON.stringify(cart));
    
    // Update the header count immediately
    if (typeof renderHeader === "function") renderHeader();
    
    alert(`${product.name} added to bag.`);
}
