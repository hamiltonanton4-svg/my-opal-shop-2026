/* --- OPALWAVE SHOP ENGINE 2026 --- */
const CART_STORAGE_KEY = "opalwave_cart";

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("shop-products");
  if (!productsContainer) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resultsCount = document.getElementById("resultsCount");
  const resetBtn = document.getElementById("resetFilters");

  // Load the apparel data
  const allProducts = DEMO_PRODUCTS; 

  function render() {
    let filtered = [...allProducts];
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortValue = sortFilter.value;

    // 1. Filter Logic
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // 2. Sort Logic
    if (sortValue === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sortValue === "price-high") filtered.sort((a, b) => b.price - a.price);

    // 3. Update UI
    resultsCount.textContent = `${filtered.length} ITEM${filtered.length === 1 ? "" : "S"}`;

    if (filtered.length === 0) {
      productsContainer.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:5rem; color:var(--text-muted);">No archive items found.</p>`;
      return;
    }

    // Use the productCard template for consistency
    productsContainer.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="product-image-wrap"><img src="${p.image}" loading="lazy"></div>
        <div class="product-info">
          <p class="section-label" style="font-size:0.5rem; margin-bottom:0.2rem;">${p.category}</p>
          <h3 class="product-title">${p.name}</h3>
          <p class="price">$${p.price}</p>
          <button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="addToCart('${p.id}')">Add to Archive</button>
        </div>
      </div>
    `).join("");
  }

  // Event Listeners
  searchInput.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
  sortFilter.addEventListener("change", render);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    sortFilter.value = "default";
    render();
  });

  render();
});
