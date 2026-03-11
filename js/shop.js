document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("shop-products");
  if (!productsContainer) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  const stockOnly = document.getElementById("stockOnly");
  const resultsCount = document.getElementById("resultsCount");
  const resetBtn = document.getElementById("resetFilters");

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") || "all";

  const allProducts = getProducts();
  const categories = getCategories(allProducts);

  categoryFilter.innerHTML = `
    <option value="all">All Categories</option>
    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
  `;

  categoryFilter.value = initialCategory;

  function render() {
    let filtered = [...allProducts];

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortValue = sortFilter.value;
    const stockOnlyChecked = stockOnly.checked;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (stockOnlyChecked) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (sortValue === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    resultsCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

    if (!filtered.length) {
      productsContainer.innerHTML = `<div class="empty-state">No products found.</div>`;
      return;
    }

    productsContainer.innerHTML = filtered.map(productCard).join("");
  }

  searchInput.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
  sortFilter.addEventListener("change", render);
  stockOnly.addEventListener("change", render);

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    sortFilter.value = "default";
    stockOnly.checked = false;
    render();
  });

  render();
});