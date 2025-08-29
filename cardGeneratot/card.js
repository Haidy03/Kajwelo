// Toast notification function
function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  // Add styles
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e74c3c'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 350px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: 500;
  `;

  // Add toast content styles
  const toastContent = toast.querySelector('.toast-content');
  toastContent.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  `;

  // Add close button styles
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;
  `;

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(255,255,255,0.2)';
  });

  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
  });

  // Add to page
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, 4000);
}

//window.products = products;

function getSellerNameById(sellerId) {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.id === sellerId);
    return user ? user.name : sellerId; // Return sellerId if user not found
  } catch (error) {
    console.error("Error getting seller name:", error);
    return sellerId; // Fallback to sellerId on error
  }
}

//window.products = products;

export function renderProducts(
  products,
  sectionId = "productssection",
  title = "Products"
) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.innerHTML = "";
  section.classList.add("best-sellers");

  const sectionheader = document.createElement("div");
  sectionheader.classList.add("section-header");
  const header = document.createElement("h2");
  header.classList.add("section-title");
  header.textContent = title;
  sectionheader.appendChild(header);

  const grid = document.createElement("div");
  grid.classList.add("products-grid");

  function goToDetails(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "/cardGeneratot/productDetail.html";
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.addEventListener("click", () => goToDetails(product));

    const imagecontainer = document.createElement("div");
    imagecontainer.classList.add("product-image");

    const overlay = document.createElement("div");
    overlay.className = "product-overlay";

    const whishListBtn = document.createElement("button");
    whishListBtn.className = "Addwishlist-btn wishlist-btn";
    whishListBtn.innerHTML = "♡";
    whishListBtn.dataset.productId = product.id;

    // wishlist check
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && Array.isArray(loggedInUser.wishlist)) {
      const isInWishlist = loggedInUser.wishlist.some(
        (item) => item.id === product.id
      );
      if (isInWishlist) {
        whishListBtn.innerHTML = "❤";
        whishListBtn.classList.add("active");
      }
    }

    whishListBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        showToast("Please log in to use the wishlist!", 'error');
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 1000);
        return;
      }
      if (!Array.isArray(loggedInUser.wishlist)) loggedInUser.wishlist = [];

      const existingIndex = loggedInUser.wishlist.findIndex(
        (item) => item.id === product.id
      );
      if (existingIndex === -1) {
        loggedInUser.wishlist.push(product);
        whishListBtn.innerHTML = "❤";
        whishListBtn.classList.add("active");
      } else {
        loggedInUser.wishlist.splice(existingIndex, 1);
        whishListBtn.innerHTML = "♡";
        whishListBtn.classList.remove("active");
      }

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === loggedInUser.id);
      if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        localStorage.setItem("users", JSON.stringify(users));
      }
    });

    const quickViewBtn = document.createElement("button");
    quickViewBtn.className = "quick-view-btn";
    quickViewBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;

    quickViewBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        showToast("Please log in to add items to your cart!", 'error');
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 2000);
        return;
      }

      if (!Array.isArray(loggedInUser.cart)) loggedInUser.cart = [];

      // Check if product already in cart
      const isInCart = loggedInUser.cart.some((item) => item.id === product.id);

      if (isInCart) {
        showToast("This item is already in your cart!", 'warning');
        quickViewBtn.textContent = "Added to Cart";
        return;
      }

      // Add product if not already in cart
      loggedInUser.cart.push(product);

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === loggedInUser.id);
      if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

       quickViewBtn.textContent = "Added to Cart";
       
       // Roast messages for add to cart
       const roasts = [
         "Wow, you actually bought something! Your wallet must be crying 😭",
         "Another impulse buy? Your bank account is having a moment of silence 💸",
         "Congratulations! You've successfully made your future self poorer 🎉",
         "Your shopping cart is getting fatter, just like your regrets 😂",
         "Money well spent... said no one ever about this purchase 💀",
         "Your cart is now heavier, and so is your financial burden 📦",
         "Another item added! Your savings account is sending its condolences 🙏",
         "Shopping spree continues! Your budget is having an existential crisis 😵",
         "You really said 'treat yourself' to your bank account's face 😤",
         "Your cart is growing faster than your self-control 🌱"
       ];
       
       const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
       showToast(randomRoast, 'success');
    });

    overlay.appendChild(quickViewBtn);
    overlay.appendChild(whishListBtn);

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name || product.title || "Product";
    image.style.width = "100%";
    image.style.height = "100%";

    // Add error handling for product images
    // image.addEventListener("error", function () {
    //   this.src =
    //     "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
    // });

    imagecontainer.appendChild(image);
    imagecontainer.appendChild(overlay);

    const info = document.createElement("div");
    info.classList.add("product-info");

    const protitle = document.createElement("h4");
    protitle.classList.add("product-title");
    protitle.textContent = product.title || product.name;

    const proBrand = document.createElement("p");
    proBrand.classList.add("product-brand");

    // Use brand if available, otherwise look up seller name
    if (product.brand) {
      proBrand.textContent = product.brand;
    } else if (product.sellerId) {
      proBrand.textContent = getSellerNameById(product.sellerId);
    } else {
      proBrand.textContent = "";
    }

    const ProPrice = document.createElement("div");
    ProPrice.classList.add("product-price");

    const currentPriceVal = product.salePrice
      ? product.salePrice
      : product.price;
    const oldPriceVal = product.salePrice ? product.price : null;


    const ProCurrentPrice = document.createElement("span");
    ProCurrentPrice.classList.add("current-price");
    ProCurrentPrice.textContent = currentPriceVal + " $";

    ProPrice.appendChild(ProCurrentPrice);

    if (oldPriceVal) {
      const ProOldPrice = document.createElement("span");
      ProOldPrice.classList.add("old-price");
      ProOldPrice.textContent = oldPriceVal + " $";
      ProPrice.appendChild(ProOldPrice);
    }

    info.appendChild(protitle);
    info.appendChild(proBrand);
    info.appendChild(ProPrice);

    card.appendChild(imagecontainer);
    card.appendChild(info);
    grid.appendChild(card);
  });

  section.appendChild(sectionheader);
  section.appendChild(grid);
}
