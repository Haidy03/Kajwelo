document.addEventListener("DOMContentLoaded", () => {
  // 1. Get container
  const orderHistoryContainer = document.getElementById(
    "orderHistory-container"
  );
  if (!orderHistoryContainer) return;

  // 2. Get user data
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  // dummy data only for testing
  // remove in production bcs it overwrites actual data
  if (!user.orderHistory || user.orderHistory.length === 0) {
    user.orderHistory = [
      {
        id: 1,
        title: "Summer Maxi Dress",
        currentprice: 300,
        oldprice: 400,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
        brand: "Nike",
        orderDate: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Silk Blouse",
        currentprice: 200,
        oldprice: 400,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
        brand: "LC",
        orderDate: new Date().toISOString(),
      },
      {
        id: 3,
        title: "Evening Cocktail Dress",
        currentprice: 300,
        oldprice: 400,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
        brand: "Defacto",
        orderDate: new Date().toISOString(),
      },
    ];
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }
  ///////////////////////////////////////////////////////
  // 4. Display orderHistory
  if (user.orderHistory?.length) {
    orderHistoryContainer.innerHTML = user.orderHistory
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
                ${
                  product.orderDate
                    ? `<p class="small text-muted mb-0">
                        Ordered on: ${new Date(
                          product.orderDate
                        ).toLocaleDateString()}
                      </p>`
                    : ""
                }
              </div>
              <!-- Removed the remove button column entirely -->
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } else {
    orderHistoryContainer.innerHTML =
      '<p class="text-muted">No orderHistory found.</p>';
  }
});
