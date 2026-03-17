/* --- OPALWAVE SHOP ENGINE 2026 --- */

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("shop-products");
  if (!productsContainer) return;

  // Selectors from our new clean HTML
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resultsCount = document.getElementById("resultsCount");
  const resetBtn = document.getElementById("resetFilters");

  // Get initial category from URL (e.g., ?category=outerwear)
  const params = new URLSearchParams(window.location.search);
  let initialCategory = params.get("category") || "all";

  // Load Data
  const allProducts = getProducts().filter(p => p.category !== 'electronics'); 
  
  // Setup Categories in Dropdown
  const availableCategories = [...new Set(allProducts.map(p => p.category))];
  
  categoryFilter.innerHTML = `
    <option value="all">ALL ARCHIVE</option>
    ${availableCategories.map(cat => `
      <option value="${cat}">${cat.toUpperCase()}</option>
    `).join("")}
  `;

  // Sync dropdown with URL parameter
  if (availableCategories.includes(initialCategory)) {
    categoryFilter.value = initialCategory;
  }

  function render() {
    let filtered = [...allProducts];

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortValue = sortFilter.value;

    // 1. Search Logic
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // 2. Category Logic
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 3. Professional Sorting
    if (sortValue === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // Default: Show newest/featured first (assuming array order or custom ID)
      filtered.sort((a, b) => b.id - a.id);
    }

    // Update Result Count
    resultsCount.textContent = `${filtered.length} ITEM${filtered.length === 1 ? "" : "S"}`;

    // Handle Empty State
    if (filtered.length === 0) {
      productsContainer.innerHTML = `
        <div style="grid-column: 1/-1; padding: 100px 0; text-align: center; color: var(--text-muted);">
          <p>No iterations found in this archive series.</p>
        </div>`;
      return;
    }

    // Render Grid using the global productCard function
    productsContainer.innerHTML = filtered.map(productCard).join("");
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

  // Initial Run
  render();
});
