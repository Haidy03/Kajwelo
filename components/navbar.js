export const navbar = `
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3">
  <div class="container">
    <a class="navbar-brand fw-bold fs-3" href="#">
      NAS
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarContent"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <div class="d-flex align-items-center w-100">
        <!-- Search Bar (takes remaining space) -->
        <div class="input-group me-auto" style="max-width: 600px;">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search the store"
          >
          <button class="btn search-btn" type="button">
                <i class="fas fa-search"></i>
              </button>
        </div>
        
        <!-- Right-aligned links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa-solid fa-heart fs-5"></i></a>
          </li>
          <li class="nav-item">
          <a href="#" class="cart-icon text-dark position-relative">
            <i class="fa-solid fa-circle-user fs-5"></i></a>
          </li>
          <li class="nav-item">
            <a href="#" class="cart-icon text-dark position-relative">
            <i class="fas fa-shopping-cart fs-5"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
`;