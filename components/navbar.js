export const navbar = `

    <nav class="custom-navbar">
        <div class="nav-container">
            <a href="/FinalHomePage.html" class="logo">
                <div class="logo-fashion-forward">
                    <div class="brand-name">KAJWELO</div>
                    <div class="tagline">Fashion & Style</div>
                </div>
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/FinalHomePage.html" class="nav-link">Home</a></li>
                <li><a href="#" id="contactus" class="nav-link">Contact</a></li>
                <li><a href="/Pages/Brands.html" class="nav-link">Brands</a></li>
            </ul>

            <!-- <div class="search-container">
                <input type="text" class="search-input" placeholder="Search products...">
                <button class="search-btn"><i class="fas fa-search"></i></button>
            </div> -->
            
           <div class="nav-icons">
    <button class="icon-btn" title="Wishlist" id="wishlistBtn" onclick="location.href='/cardGeneratot/wishlist.html'">
        <i class="fas fa-heart"></i>
        <span class="cart-count" id="wishlistCount">3</span>
    </button>

    <button class="icon-btn" title="Cart" id="cartBtn" onclick="location.href='/Pages/Cart.html'">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" id="cartCount">3</span>
    </button>
<!-- New Profile Icon -->
<button class="icon-btn" title="Profile" id="profileBtn">
    <i class="fas fa-user-circle"></i>
</button>

    </button>
    <button class="icon-btn" title="Login" id="loginBtn"><i class="fas fa-user"></i></button>


    <button class="icon-btn" title="Logout" id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button>

    

    <button class="mobile-menu-btn" onclick="toggleMenu()"><i class="fas fa-bars"></i></button>
</div>

        </div>
    </nav>

`;

document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    if (!localStorage.getItem("loggedInUser")) {
      // Hide the button if the user is not logged in
      profileBtn.style.display = "none";
    } else {
      // Add the event only if user is logged in
      profileBtn.addEventListener("click", () => {
        location.href = "/Pages/userProfile.html";
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("wishlistBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      if (localStorage.getItem("loggedInUser")) {
        location.href = "/cardGeneratot/wishlist.html";
      } else {
        alert("You have to sign in first");
        location.href = "/login.html";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("contactus");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      if (localStorage.getItem("loggedInUser")) {
        location.href = "/Pages/contact.html";
      } else {
        alert("You have to sign in first");
        location.href = "/login.html";
      }
    });
  }
});
