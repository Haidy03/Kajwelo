document.addEventListener("DOMContentLoaded", () => {
  // 1. Get container
  const orderHistoryContainer = document.getElementById(
    "orderHistory-container"
  );
  if (!orderHistoryContainer) return;

  // 2. Get user data
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  // 3. Display orderHistory
  if (user.orderHistory?.length) {
    orderHistoryContainer.innerHTML = user.orderHistory
      .map((order) => {
        return `
          <div class="order mb-4 p-3 border rounded shadow-sm">
            <h5 class="mb-2">Order #${order.orderId}</h5>
            <p class="small text-muted mb-1">Placed on: ${new Date(
              order.orderedAt
            ).toLocaleDateString()}</p>
            <p class="small text-muted mb-1">Status: ${order.status}</p>
            <p class="small text-muted mb-3">Total: $${order.totalPrice.toFixed(
              2
            )}</p>

            ${order.products
              .map(
                (product) => `
                <div class="card wishlist-card border-0 shadow-sm mb-2">
                  <div class="card-body p-2">
                    <div class="row">
                      <div class="col-md-8">
                        <p class="mb-1"><strong>Product ID:</strong> ${product.productId}</p>
                        <p class="mb-1">Size: ${product.size}</p>
                        <p class="mb-1">Color: ${product.color}</p>
                        <p class="mb-1">Quantity: ${product.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        `;
      })
      .join("");
  } else {
    orderHistoryContainer.innerHTML =
      '<p class="text-muted">No order history found.</p>';
  }
});
