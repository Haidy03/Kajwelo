document.addEventListener("DOMContentLoaded", function () {
  try {
    // Load loggedInUser
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser || !Array.isArray(loggedInUser.wishlist)) {
      loggedInUser = { wishlist: [] };
    }

    let wishlist = loggedInUser.wishlist;

    // Get the container where cards will be inserted
    const wishlistContainer = document.getElementById("wishlist-container");

    // Update wishlist count in the heading
    const wishlistCount = document.querySelector("h4");
    if (wishlistCount) {
      wishlistCount.textContent = `Wishlist (${wishlist.length})`;
    }

    // Display message if wishlist is empty
    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-heart-broken fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Your wishlist is empty</h5>
          <p class="text-muted">Start adding items to see them here</p>
          <a href="cardsss.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    // Generate and insert cards for each wishlist item
    wishlistContainer.innerHTML = wishlist
      .map(
        (product) => `
      <div class="col-12" data-id="${product.id}">
        <div class="card wishlist-card border-0 shadow-sm pb-2 mb-3">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-md-2">
                <img src="${product.image}" alt="${product.title}" 
                     class="img-fluid rounded" style="height: 80px; width: auto;">
              </div>
              <div class="col-md-8">
                <h5 class="card-title mb-1">${product.title}</h5>
                <p class="card-text text-muted mb-1 small">${product.brand}</p>
                <div class="price-container d-flex align-items-center mb-2">
                  <span class="fw-bold me-2">$${product.currentprice.toFixed(
                    2
                  )}</span>
                  ${
                    product.oldprice
                      ? `<span class="text-decoration-line-through text-muted small">
                          $${product.oldprice.toFixed(2)}
                        </span>`
                      : ""
                  }
                </div>
              </div>
              <div class="col-md-2 d-flex align-items-center justify-content-end">
                <button class="btn btn-outline-danger btn-sm remove-wishlist-btn">
                  <i class="fas fa-trash-alt me-1"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Hook up remove buttons
    document.querySelectorAll(".remove-wishlist-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const card = this.closest("[data-id]");
        const productId = parseInt(card.getAttribute("data-id"));

        // Remove from loggedInUser.wishlist
        loggedInUser.wishlist = loggedInUser.wishlist.filter(
          (item) => item.id !== productId
        );

        // Save changes back
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        // Also update users array
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex((u) => u.id === loggedInUser.id);
        if (userIndex !== -1) {
          users[userIndex] = loggedInUser;
          localStorage.setItem("users", JSON.stringify(users));
        }

        // Remove card from DOM
        card.remove();

        // Update counter
        if (wishlistCount) {
          wishlistCount.textContent = `Wishlist (${loggedInUser.wishlist.length})`;
        }

        // Show empty message if none left
        if (loggedInUser.wishlist.length === 0) {
          wishlistContainer.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="fas fa-heart-broken fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">Your wishlist is empty</h5>
              <p class="text-muted">Start adding items to see them here</p>
              <a href="cardsss.html" class="btn btn-primary">Browse Products</a>
            </div>
          `;
        }
      });
    });
  } catch (error) {
    console.error("Error loading wishlist:", error);
    const wishlistContainer = document.getElementById("wishlist-container");
    if (wishlistContainer) {
      wishlistContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <h5 class="text-danger">Error loading wishlist</h5>
          <p class="text-muted">Please try refreshing the page</p>
        </div>
      `;
    }
  }
});
