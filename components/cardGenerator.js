import { CartManager } from "../utils/cartManager.js"
import { showToast } from "./toast.js"
import { Auth } from "../utils/auth.js";
import {generateModal} from "./modalGenerator.js"
// components/generateCard.js

// components/generateCard.js

export function generateCard(product) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card shadow-sm";
  cardDiv.style.width = "18rem";

  const img = document.createElement("img");
  img.src = product.image;
  img.className = "card-img-top";
  img.alt = product.title;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = product.title;

  const desc = document.createElement("p");
  desc.className = "card-text small text-muted";
  desc.textContent = product.description;

  const price = document.createElement("p");
  price.className = "card-text fw-bold";
  price.textContent = `${product.price} EGP`;

  const btn = document.createElement("button");
  btn.className = "btn btn-primary w-100";
  btn.textContent = "Add to Cart";
  btn.onclick = function () {
    if (!Auth.isLoggedIn()) {
      showToast("Please login to add items to cart", "warning");

      // Optional: Open login modal dynamically
      generateModal(
        "loginPrompt",
        "Login Required",
        `
          <p class="mb-3">You must be logged in to add items to your cart.</p>
          <input type="email" placeholder="Email" class="form-control mb-2" id="loginEmail">
          <input type="password" placeholder="Password" class="form-control mb-2" id="loginPassword">
        `,
        `
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-success" onclick="handleQuickLogin()">Login</button>
        `
      );
      return;
    }

    CartManager.addItem(product);
    showToast(`${product.title} added to cart`, "success");
  };

  cardBody.append(title, desc, price, btn);
  cardDiv.append(img, cardBody);

  return cardDiv;
}

