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
  const section = this.document.getElementById("productssection");
  section.classList.add("best-sellers");

  const sectionheader = this.document.createElement("div"); //div for header
  sectionheader.classList.add("section-header");
  const header = this.document.createElement("h2"); // header content
  header.classList.add("section-title");
  header.textContent = "women section";

  sectionheader.appendChild(header);

  const grid = document.createElement("grid"); //container for all cards
  console.log(grid);
  grid.classList.add("products-grid");

  products.forEach((product) => {
    const card = this.document.createElement("div"); //card element
    card.classList.add("product-card");

    const imagecontainer = this.document.createElement("div"); // image div for this card
    imagecontainer.classList.add("product-image");

    const badge = document.createElement("div");
    badge.className = "product-badge";

    const overlay = document.createElement("div");
    overlay.className = "product-overlay";
    /////
    const whishListBtn = this.document.createElement("button");
    whishListBtn.className = "Addwishlist-btn wishlist-btn";
    whishListBtn.innerHTML = "♡";
    whishListBtn.dataset.productId = product.id; // NEW

    whishListBtn.addEventListener("click", function () {
      // 1. Get logged-in user
      let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!loggedInUser) {
        alert("You need to log in to use wishlist!");
        window.location.href = "/login-register.html"; // redirect after alert
        return;
      }

      // 2. Ensure wishlist exists
      if (!Array.isArray(loggedInUser.wishlist)) {
        loggedInUser.wishlist = [];
      }

      // 3. Check if product is already in wishlist
      const existingIndex = loggedInUser.wishlist.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex === -1) {
        // Add product
        loggedInUser.wishlist.push(product);
        whishListBtn.innerHTML = "❤";
        whishListBtn.classList.add("active");
      } else {
        // Remove product
        loggedInUser.wishlist.splice(existingIndex, 1);
        whishListBtn.innerHTML = "♡";
        whishListBtn.classList.remove("active");
      }

      // 4. Save back to loggedInUser
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      // 5. Also sync with users array
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.id === loggedInUser.id);
      if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      console.log("Wishlist updated:", loggedInUser.wishlist);
    });

    //////////////////

    const quickViewBtn = this.document.createElement("button");
    quickViewBtn.className = "quick-view-btn";
    quickViewBtn.textContent = "";
    quickViewBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;

    overlay.appendChild(quickViewBtn);
    overlay.appendChild(whishListBtn);

    const image = this.document.createElement("img"); //the image
    image.src = product.image;
    image.style.width = "100%";
    image.style.height = "100%";

    imagecontainer.appendChild(image);
    imagecontainer.appendChild(overlay);

    const info = this.document.createElement("div"); //div for the info about the product
    info.classList.add("product-info");

    const protitle = document.createElement("h4"); // h4 for the product title
    protitle.classList.add("product-title");
    protitle.textContent = product.title;

    const proBrand = document.createElement("p"); //  Parag for the product brand
    proBrand.classList.add("product-brand");
    proBrand.textContent = product.brand;

    const ProPrice = this.document.createElement("div"); // Div for the product price=>contains the product old and current prices
    ProPrice.classList.add("product-price");

    const ProCurrentPrice = this.document.createElement("span"); //span for the current price
    ProCurrentPrice.classList.add("current-price");
    ProCurrentPrice.textContent = product.currentprice + " $";

    const ProOldPrice = this.document.createElement("span"); //span for the old price
    ProOldPrice.classList.add("old-price");
    ProOldPrice.textContent = product.oldprice;

    ProPrice.appendChild(ProCurrentPrice);
    ProPrice.appendChild(ProOldPrice);

    info.appendChild(protitle);
    info.appendChild(proBrand);
    info.appendChild(ProPrice);

    card.appendChild(imagecontainer);
    card.appendChild(info);

    grid.appendChild(card);

    section.appendChild(sectionheader);
    section.appendChild(grid);
  }); //end of loop
}); //end of window load
