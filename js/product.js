document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("product-detail");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const product = getProducts().find(p => p.slug === slug);

  if (!product) {
    wrap.innerHTML = `<div class="empty-state">Product not found.</div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="product-detail">
      <div class="card product-media">
        <img src="${product.image}" alt="${product.name}" />
      </div>

      <div class="card product-info">
        <p class="section-label">${product.category}</p>
        <h1>${product.name}</h1>

        <div class="price-row">
          <span class="price">${money(product.price)}</span>
          ${product.compareAt ? `<span class="compare-price">${money(product.compareAt)}</span>` : ""}
        </div>

        <div class="badges">
          <span class="badge">${product.inStock ? "In Stock" : "Out of Stock"}</span>
          ${product.brand ? `<span class="badge">${product.brand}</span>` : ""}
          ${product.featured ? `<span class="badge">Featured</span>` : ""}
        </div>

        <p>${product.description}</p>

        <div style="margin-top: 1.5rem;">
          <button class="btn btn-primary full" onclick="addToCart('${product.id}')">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
});