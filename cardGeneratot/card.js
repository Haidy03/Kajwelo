const products = [
  {
    id: 1,
    title: "Summer Maxi Dress",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "Nike",
  },
  {
    id: 2,
    title: "Silk Blouse",
    currentprice: 200,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "LC",
  },
  {
    id: 3,
    title: "Evening Cocktail Dress",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "Defacto",
  },
  {
    id: 4,
    title: "Chiffon Blouse",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "Adidas",
  },
  {
    id: 5,
    title: "Floral Wrap Dress",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "Nike",
  },
  {
    id: 6,
    title: "Lace Detail Blouse",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "LC",
  },
  {
    id: 7,
    title: "Vintage Midi Dress",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "Defacto",
  },
  {
    id: 8,
    title: "Striped Cotton Blouse",
    currentprice: 300,
    oldprice: 400,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",
    brand: "Adidas",
  },
];

window.products = products;

window.addEventListener("load", function () {
  const section = document.getElementById("productssection");
  section.classList.add("best-sellers");

  const sectionheader = document.createElement("div");
  sectionheader.classList.add("section-header");
  const header = document.createElement("h2");
  header.classList.add("section-title");
  header.textContent = "Women Section";
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

    // Prevent card click when pressing wishlist
    whishListBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      // --- wishlist logic ---
      let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        alert("You need to log in to use wishlist!");
        window.location.href = "/login-register.html";
        return;
      }
      if (!Array.isArray(loggedInUser.wishlist)) {
        loggedInUser.wishlist = [];
      }
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

    // Add-to-cart (Quick View) button
    const quickViewBtn = document.createElement("button");
    quickViewBtn.className = "quick-view-btn";
    quickViewBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;
    quickViewBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      alert(`${product.title} added to cart!`);
    });

    overlay.appendChild(quickViewBtn);
    overlay.appendChild(whishListBtn);

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.style.width = "100%";
    image.style.height = "100%";

    imagecontainer.appendChild(image);
    imagecontainer.appendChild(overlay);

    // Info
    const info = document.createElement("div");
    info.classList.add("product-info");

    const protitle = document.createElement("h4");
    protitle.classList.add("product-title");
    protitle.textContent = product.title;

    const proBrand = document.createElement("p");
    proBrand.classList.add("product-brand");
    proBrand.textContent = product.brand;

    const ProPrice = document.createElement("div");
    ProPrice.classList.add("product-price");

    const ProCurrentPrice = document.createElement("span");
    ProCurrentPrice.classList.add("current-price");
    ProCurrentPrice.textContent = product.currentprice + " $";

    const ProOldPrice = document.createElement("span");
    ProOldPrice.classList.add("old-price");
    ProOldPrice.textContent = product.oldprice + " $";

    ProPrice.appendChild(ProCurrentPrice);
    ProPrice.appendChild(ProOldPrice);

    info.appendChild(protitle);
    info.appendChild(proBrand);
    info.appendChild(ProPrice);

    card.appendChild(imagecontainer);
    card.appendChild(info);

    grid.appendChild(card);
  });

  section.appendChild(sectionheader);
  section.appendChild(grid);
});
