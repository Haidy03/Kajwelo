import { Storage } from "../utils/localStorageHelper.js";
import { renderProducts } from "./renderProducts.js";


export function applyFilters() {
    const allProducts = Storage.get("products", []);
    const selectedCats = Array.from(document.querySelectorAll(".filter-category:checked")).map(c => c.value);

    const filtered = selectedCats.length
        ? allProducts.filter(p => selectedCats.includes(p.category))
        : allProducts;

    renderProducts("productsContainer", filtered);
}