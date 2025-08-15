export const navbar = `

    <nav class="custom-navbar">
        <div class="nav-container">
            <a href="#" class="logo">Kajwelo</a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="#" class="nav-link">Home</a></li>
                <li><a href="#" class="nav-link">Contact</a></li>
                <li><a href="#" class="nav-link">Brands</a></li>
            </ul>

            <!-- <div class="search-container">
                <input type="text" class="search-input" placeholder="Search products...">
                <button class="search-btn"><i class="fas fa-search"></i></button>
            </div> -->
            
            <div class="nav-icons">
                <button class="icon-btn" title="Login" id="loginBtn"><i class="fas fa-user"></i></button>
                <button class="icon-btn" title="Logout" id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button>
<button class="icon-btn" title="Wishlist" onclick="location.href='/cardGeneratot/wishlist.html'">
  <i class="fas fa-heart"></i>
</button>
                <button class="icon-btn" title="Cart" id="cartBtn">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count" id="cartCount">3</span>
                </button>
                <button class="mobile-menu-btn" onclick="toggleMenu()"><i class="fas fa-bars"></i></button>
            </div>
        </div>
    </nav>

`;
