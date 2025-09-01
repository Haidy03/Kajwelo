// AdminDashBoard_data.js
// LocalStorage-backed data layer for Admin Dashboard
// Builds dataStore from project localStorage and preserves existing API surface used by other scripts.

(function () {
  // Helpers to safely read/write localStorage without external imports
  function lsGet(key, def = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : def;
    } catch (e) {
      return def;
    }
  }
  function lsSet(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Map Admin.adminLevel -> role label
  function adminLevelToLabel(lvl) {
    switch (lvl) {
      case 3: return "master";
      case 2: return "super";
      case 1: return "product";
      default: return "admin";
    }
  }

  // Compute stock count from various shapes
  function computeStockCount(p) {
    // In project, Seller.products[].stock can be an array of { size, color, quantity }
    // or a number. Support both.
    if (Array.isArray(p?.stock)) {
      return p.stock.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    }
    const n = Number(p?.stock);
    return Number.isFinite(n) ? n : 0;
  }

  function buildFromLocalStorage() {
    const users = lsGet("users", []);
    const currentUser = lsGet("loggedInUser", null);

    // Partition users
    const sellers = users.filter(u => (u.role || "").toLowerCase() === "seller");
    const customers = users.filter(u => (u.role || "").toLowerCase() === "customer");
    const admins = users.filter(u => (u.role || "").toLowerCase() === "admin" || (u.role || "") === "Admin");

    // Flatten products from sellers, filtering only verified products (isVerified = true) from verified sellers
    const products = [];

    sellers.forEach(s => {
      (s.products || []).forEach(p => {
        // Include only verified products from verified sellers
        if (s.isVerified && p.isVerified) {
          const stock = computeStockCount(p);
          let status = "active";
          if (stock === 0) status = "inactive";
          else if (stock > 0 && stock < 10) status = "low-stock";

          products.push({
            id: p.id,
            name: p.name || "Unnamed Product",
            category: p.category || "General",
            subcategory: p.subcategory || "",
            price: Number(p.price) || 0,
            stock,
            status, // UI stock/status
            description: p.description || "",
            sellerId: s.id,
            isVerified: p.isVerified === true, // Show actual verification status
          });
        }
      });
    });

    // Derive categories from products
    const categoryMap = new Map();
    products.forEach(p => {
      const key = p.category || "General";
      const prev = categoryMap.get(key) || 0;
      categoryMap.set(key, prev + 1);
    });
    const categories = Array.from(categoryMap.entries()).map(([name, count], i) => ({
      id: i + 1,
      name,
      productCount: count,
      status: count > 0 ? "active" : "inactive",
      description: `${name} category`,
    }));

    // Derive subcategories from products
    const subcategoryMap = new Map();
    products.forEach(p => {
      const key = p.subcategory || "";
      if (!key) return;
      const prev = subcategoryMap.get(key) || 0;
      subcategoryMap.set(key, prev + 1);
    });
    const subcategories = Array.from(subcategoryMap.entries()).map(([name, count], i) => ({
      id: i + 1,
      name,
      productCount: count,
      status: count > 0 ? "active" : "inactive",
      description: `${name} subcategory`,
    }));

    // Sellers table light projection
    // Include all sellers, not just verified ones
    const sellersTable = sellers.map(s => ({
        id: s.id,
        name: s.name || s.brandName || "Seller",
        email: s.email,
        phone: s.phone || "",
        address: s.businessAddress || s.address || "",
        status: s.isVerified ? "active" : "inactive", // Show actual verification status
        joinDate: (s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : ""),
        rating: Number(s.rating) || 4.5,
        isVerified: s.isVerified === true, // Include actual verification status
    }));

    // Customers table light projection
    const customersTable = customers.map(c => ({
      id: c.id,
      name: c.name || "Customer",
      email: c.email,
      phone: c.phone || "",
      orders: (c.orderHistory && Array.isArray(c.orderHistory)) ? c.orderHistory.length : (c.orders && Array.isArray(c.orders)) ? c.orders.length : (Number(c.orders) || 0),
      totalSpent: c.orderHistory && Array.isArray(c.orderHistory) ? 
        c.orderHistory.reduce((total, order) => total + (parseFloat(order.totalPrice) || 0), 0) : 
        Number(c.totalSpent) || 0,
      status: c.isConfirmed ? "active" : "inactive",
      joinDate: (c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : ""),
    }));

    // Admins table light projection
    const currentUserId = currentUser?.id;
    const adminsTable = admins
      .filter(a => String(a.id) !== String(currentUserId)) // Exclude current logged-in admin
      .map(a => ({
        id: a.id,
        name: a.name || "Admin",
        email: a.email,
        role: adminLevelToLabel(Number(a.adminLevel) || 1),
        password: "********", // hide actual stored value (may be encoded)
        status: a.isConfirmed === false ? "inactive" : "active",
        lastLogin: a.lastLogin || new Date().toISOString().slice(0, 10),
      }));

    // Verification requests derived from unverified sellers/products
    let vrId = 1;
    const verificationRequests = [];

    sellers.forEach(s => {
      if (!s.isVerified) {
        verificationRequests.push({
          id: vrId++,
          title: "Seller Verification",
          message: `Seller ${s.name || s.brandName || s.email} requests verification`,
          date: new Date().toISOString().slice(0, 10),
          status: "unverified",
          type: "seller",
          entityId: s.id,
        });
      }
      
      // Check for unverified products from verified sellers
      if (s.isVerified && Array.isArray(s.products)) {
        s.products.forEach(p => {
          if (!p.isVerified) {
            verificationRequests.push({
              id: vrId++,
              title: "Product Verification",
              message: `Product ${p.name} needs verification`,
              date: new Date().toISOString().slice(0, 10),
              status: "unverified",
              type: "product",
              entityId: p.id,
              sellerId: s.id,
            });
          }
        });
      }
    });

    // Inbox placeholder: try to read per-admin inbox if exists
    const inboxKey = currentUser ? `adminInbox_${currentUser.id}` : null;
    const inbox = inboxKey ? lsGet(inboxKey, []) : [];

    // Sales placeholder (not integrated with models here)
    const sales = lsGet("sales", []);

    const currentAdmin = currentUser && ((currentUser.role || "").toLowerCase() === "admin" || currentUser.role === "Admin")
      ? {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          password: "********",
          adminLevel: Number(currentUser.adminLevel) || 1,
        }
      : null;

    return {
      products,
      categories,
      subcategories,
      customers: customersTable,
      sales,
      verificationRequests,
      inbox,
      sellers: sellersTable,
      admins: adminsTable,
      currentAdmin,
      dashboardStats: {},
    };
  }

  // Initialize dataStore from LS; if empty users, fallback to previous static demo dataset
  let dataStoreLS = buildFromLocalStorage();

  // Keep compatibility with existing code
  window.dataStore = dataStoreLS;

  // Generate unique IDs for new items (within current section data)
  window.generateId = function generateId(section) {
    const arr = Array.isArray(window.dataStore?.[section]) ? window.dataStore[section] : [];
    const existing = arr.map(it => Number(it.id) || 0);
    const max = existing.length ? Math.max(...existing) : 0;
    return max + 1;
  };

  // Helper function to get seller name by ID
  window.getSellerNameById = function getSellerNameById(sellerId) {
    const s = (window.dataStore?.sellers || []).find(s => s.id === sellerId);
    return s ? (s.name || "Seller") : "Unknown Seller";
  };

  // Helper function to get seller by ID
  window.getSellerById = function getSellerById(sellerId) {
    return (window.dataStore?.sellers || []).find(s => s.id === sellerId) || null;
  };

  // Helper function to get products by seller ID
  window.getProductsBySeller = function getProductsBySeller(sellerId) {
    return (window.dataStore?.products || []).filter(p => p.sellerId === sellerId);
  };

  // Helper function to get categories by seller ID
  window.getCategoriesBySeller = function getCategoriesBySeller(sellerId) {
    const prods = window.getProductsBySeller(sellerId);
    const set = new Set(prods.map(p => p.category || "General"));
    return (window.dataStore?.categories || []).filter(c => set.has(c.name));
  };

  // Compute dashboard stats
  window.calculateDashboardStats = function calculateDashboardStats() {
    const ds = window.dataStore;
    ds.dashboardStats = {
      totalSellers: (ds.sellers || []).filter(s => s.status === 'active').length,
      totalCustomers: (ds.customers || []).filter(c => c.status === 'active').length,
      totalProducts: (ds.products || []).filter(p => p.isVerified).length,
      totalCategories: (ds.categories || []).length,
      recentOrders: (ds.sales || []).slice(0, 5),
    };
  };

  // Initialize appState (unchanged API)
  window.appState = {
    currentSection: 'dashboard',
    currentFilter: 'all',
    currentSort: { field: 'name', direction: 'asc' },
    searchQuery: '',
    editingItem: null,
    currentPage: 1,
    itemsPerPage: 5,
    unreadVerifications: (window.dataStore.verificationRequests || []).filter(r => r.status === 'unverified').length,
    unreadMessages: (window.dataStore.inbox || []).filter(m => m.status === 'unread').length,
    selectedItems: new Set(),
    selectAll: false,
    isPasswordConfirmed: false,
    filterBySeller: null,
    currentMessageSeller: null,
  };
})();
