export const navbar =`

    <nav class="navbar">
        <div class="nav-container">
            <a href="#" class="logo">Kajwelo</a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="#" class="nav-link">Home</a></li>
                <li><a href="#" class="nav-link">Contact</a></li>
                <li><a href="#" class="nav-link">Brands</a></li>
            </ul>

            
            <div class="nav-icons">
                <button class="icon-btn" title="Login"><i class="fas fa-user"></i></button>
                <button class="icon-btn" title="Logout"><i class="fas fa-sign-out-alt"></i></button>
                <button class="icon-btn" title="Wishlist"><i class="fas fa-heart"></i></button>
                <button class="icon-btn" title="Cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">3</span>
                </button>
                <button class="mobile-menu-btn" onclick="toggleMenu()"><i class="fas fa-bars"></i></button>
            </div>
        </div>
    </nav>

`;