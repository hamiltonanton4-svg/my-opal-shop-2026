document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const list = document.getElementById("admin-product-list");
  const resetProductsBtn = document.getElementById("resetProductsBtn");

  if (!form || !list) return;

  function renderAdminProducts() {
    const products = getProducts();

    if (!products.length) {
      list.innerHTML = `<div class="empty-state">No products available.</div>`;
      return;
    }

    list.innerHTML = products.map(product => `
      <div class="admin-item reveal">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <h3>${product.name}</h3>
          <p class="muted">${product.category} • ${money(product.price)}</p>
          <p class="muted">${product.inStock ? "In Stock" : "Out of Stock"}</p>
        </div>
        <div class="admin-actions">
          <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
      </div>
    `).join("");

    initReveal();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const products = getProducts();

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const compareAtValue = document.getElementById("compareAt").value;
    const compareAt = compareAtValue ? parseFloat(compareAtValue) : null;
    const category = document.getElementById("category").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const image = document.getElementById("image").value.trim();
    const description = document.getElementById("description").value.trim();
    const featured = document.getElementById("featured").checked;
    const inStock = document.getElementById("inStock").checked;

    const newProduct = {
      id: "p_" + Date.now(),
      name,
      slug: slugify(name),
      description,
      price,
      compareAt,
      category,
      brand,
      image,
      featured,
      inStock
    };

    products.unshift(newProduct);
    setProducts(products);
    form.reset();
    document.getElementById("inStock").checked = true;

    renderAdminProducts();
    showToast("Product saved");
  });

  resetProductsBtn.addEventListener("click", () => {
    resetProducts();
    renderAdminProducts();
    showToast("Demo products restored");
  });

  window.deleteProduct = function(productId) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    const products = getProducts().filter(product => product.id !== productId);
    setProducts(products);

    const cart = getCart().filter(item => item.id !== productId);
    setCart(cart);

    renderAdminProducts();
    showToast("Product deleted");
  };

  renderAdminProducts();
});