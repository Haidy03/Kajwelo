document.addEventListener("DOMContentLoaded", function () {
  try {
    // Load wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

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

    document.querySelectorAll(".remove-wishlist-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const card = this.closest("[data-id]");
        const productId = parseInt(card.getAttribute("data-id"));

        const updatedWishlist = wishlist.filter(
          (item) => item.id !== productId
        );

        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        card.remove();

        if (wishlistCount) {
          wishlistCount.textContent = `Wishlist (${updatedWishlist.length})`;
        }

        if (updatedWishlist.length === 0) {
          wishlistContainer.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="fas fa-heart-broken fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">Your wishlist is empty</h5>
              <p class="text-muted">Start adding items to see them here</p>
              <a href="cardsss.html" class="btn btn-primary" >Browse Products</a>
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
