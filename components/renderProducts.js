import {generateCard} from "./cardGenerator.js"


export function renderProducts(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // clear existing

    if (!products.length) {
        container.innerHTML = "<p class='text-muted'>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const card = generateCard(product);
        container.appendChild(card);
    });
}


