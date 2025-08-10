export function generateFilterSidebar(categories, containerId = "filterSidebar") {
  const container = document.getElementById(containerId);
  container.innerHTML = `<h5 class="mb-3">Filter by Category</h5>`;

  categories.forEach(category => {
    const id = `filter-${category.toLowerCase()}`;
    container.innerHTML += `
      <div class="form-check">
        <input class="form-check-input filter-category" type="checkbox" value="${category}" id="${id}">
        <label class="form-check-label" for="${id}">
          ${category}
        </label>
      </div>
    `;
  });
}

