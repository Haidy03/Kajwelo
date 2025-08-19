const dataStore = {
    products: [
        { id: 1, name: "Wireless Headphones", category: "Electronics", price: 99.99, stock: 45, status: "active", description: "High-quality wireless headphones", sellerId: 1 },
        { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 12, status: "active", description: "Advanced fitness tracking smartwatch", sellerId: 1 },
        { id: 3, name: "Cotton T-Shirt", category: "Clothing", price: 24.99, stock: 78, status: "active", description: "100% cotton comfortable t-shirt", sellerId: 2 },
        { id: 4, name: "Gaming Mouse", category: "Electronics", price: 59.99, stock: 23, status: "active", description: "RGB gaming mouse with high DPI", sellerId: 1 },
        { id: 5, name: "Leather Jacket", category: "Clothing", price: 159.99, stock: 8, status: "low-stock", description: "Premium leather jacket", sellerId: 2 },
        { id: 6, name: "Bluetooth Speaker", category: "Electronics", price: 79.99, stock: 0, status: "inactive", description: "Portable bluetooth speaker", sellerId: 5 },
        { id: 7, name: "Running Shoes", category: "Sports", price: 89.99, stock: 34, status: "active", description: "Comfortable running shoes", sellerId: 3 },
        { id: 8, name: "Coffee Maker", category: "Home & Kitchen", price: 129.99, stock: 15, status: "active", description: "Automatic drip coffee maker", sellerId: 4 },
        { id: 9, name: "Yoga Mat", category: "Sports", price: 29.99, stock: 56, status: "active", description: "Non-slip yoga mat", sellerId: 3 },
        { id: 10, name: "Tablet Stand", category: "Electronics", price: 19.99, stock: 67, status: "active", description: "Adjustable tablet stand", sellerId: 4 }
    ],
    categories: [
        { id: 1, name: "Electronics", productCount: 45, status: "active", description: "Electronic devices and gadgets", sellerId: 1 },
        { id: 2, name: "Clothing", productCount: 128, status: "active", description: "Apparel and fashion items", sellerId: 2 },
        { id: 3, name: "Sports", productCount: 32, status: "active", description: "Sports and fitness equipment", sellerId: 3 },
        { id: 4, name: "Home & Kitchen", productCount: 67, status: "active", description: "Home appliances and kitchenware", sellerId: 4 },
        { id: 5, name: "Books", productCount: 89, status: "active", description: "Books and educational materials", sellerId: 6 },
        { id: 6, name: "Beauty", productCount: 23, status: "inactive", description: "Beauty and personal care products", sellerId: 2 },
        { id: 7, name: "Toys", productCount: 45, status: "active", description: "Toys and games for all ages", sellerId: 3 }
    ],
    customers: [
        { id: 1, name: "John Smith", email: "john@example.com", phone: "+1-555-0101", orders: 5, totalSpent: 1245.99, status: "active", joinDate: "2024-01-15" },
        { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1-555-0102", orders: 12, totalSpent: 2890.45, status: "active", joinDate: "2023-12-20" },
        { id: 3, name: "Mike Brown", email: "mike@example.com", phone: "+1-555-0103", orders: 3, totalSpent: 456.78, status: "active", joinDate: "2024-02-10" },
        { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "+1-555-0104", orders: 8, totalSpent: 1678.23, status: "active", joinDate: "2023-11-30" },
        { id: 5, name: "David Wilson", email: "david@example.com", phone: "+1-555-0105", orders: 1, totalSpent: 89.99, status: "inactive", joinDate: "2024-03-05" },
        { id: 6, name: "Lisa Garcia", email: "lisa@example.com", phone: "+1-555-0106", orders: 15, totalSpent: 3245.67, status: "active", joinDate: "2023-10-12" },
        { id: 7, name: "Robert Taylor", email: "robert@example.com", phone: "+1-555-0107", orders: 7, totalSpent: 1523.45, status: "active", joinDate: "2024-01-08" },
        { id: 8, name: "Jessica Martinez", email: "jessica@example.com", phone: "+1-555-0108", orders: 4, totalSpent: 678.90, status: "active", joinDate: "2024-02-25" }
    ],
    sales: [
        { id: 1001, date: "2025-01-15", customer: "John Smith", amount: 199.99, status: "completed", items: 2 },
        { id: 1002, date: "2025-01-14", customer: "Sarah Johnson", amount: 459.98, status: "completed", items: 3 },
        { id: 1003, date: "2025-01-13", customer: "Mike Brown", amount: 89.99, status: "pending", items: 1 },
        { id: 1004, date: "2025-01-12", customer: "Emily Davis", amount: 329.97, status: "completed", items: 4 },
        { id: 1005, date: "2025-01-11", customer: "David Wilson", amount: 89.99, status: "completed", items: 1 },
        { id: 1006, date: "2025-01-10", customer: "Lisa Garcia", amount: 679.95, status: "completed", items: 5 },
        { id: 1007, date: "2025-01-09", customer: "Robert Taylor", amount: 149.98, status: "pending", items: 2 },
        { id: 1008, date: "2025-01-08", customer: "Jessica Martinez", amount: 234.97, status: "completed", items: 3 }
    ],
    verificationRequests: [
        { id: 1, title: "Seller Verification", message: "New seller Tech Gadgets Inc. requests verification", date: "2025-01-15", status: "unverified", type: "seller", entityId: 1 },
        { id: 2, title: "Product Verification", message: "New product Wireless Headphones needs verification", date: "2025-01-14", status: "unverified", type: "product", entityId: 1 },
        { id: 3, title: "Seller Verification", message: "Seller Fashion Forward verified", date: "2025-01-13", status: "verified", type: "seller", entityId: 2 },
        { id: 4, title: "Customer Verification", message: "New customer Jessica Martinez requests verification", date: "2025-01-12", status: "unverified", type: "customer", entityId: 8 },
        { id: 5, title: "Product Verification", message: "Product Smart Watch verified", date: "2025-01-11", status: "verified", type: "product", entityId: 2 },
        { id: 6, title: "Seller Verification", message: "Seller Sports Zone verified", date: "2025-01-10", status: "verified", type: "seller", entityId: 3 },
        { id: 7, title: "Customer Verification", message: "Customer John Smith verified", date: "2025-01-09", status: "verified", type: "customer", entityId: 1 }
    ],
    inbox: [
        { id: 1, subject: "New Support Ticket", message: "Customer is having issues with their recent order", sender: "John Smith", date: "2025-01-15", status: "unread", type: "support" },
        { id: 2, subject: "Payment Issue", message: "Payment failed for order #1002", sender: "Sarah Johnson", date: "2025-01-14", status: "unread", type: "payment" },
        { id: 3, subject: "Account Inquiry", message: "Customer wants to update their account information", sender: "Mike Brown", date: "2025-01-13", status: "read", type: "account" },
        { id: 4, subject: "Product Question", message: "Question about product specifications", sender: "Emily Davis", date: "2025-01-12", status: "unread", type: "product" },
        { id: 5, subject: "Refund Request", message: "Customer is requesting a refund for order #1005", sender: "David Wilson", date: "2025-01-11", status: "unread", type: "refund" },
        { id: 6, subject: "Shipping Delay", message: "Order #1006 is delayed in shipping", sender: "Lisa Garcia", date: "2025-01-10", status: "read", type: "shipping" },
        { id: 7, subject: "Feedback", message: "Customer left feedback about their experience", sender: "Robert Taylor", date: "2025-01-09", status: "unread", type: "feedback" }
    ],
    sellers: [
        { id: 1, name: "Tech Gadgets Inc.", email: "contact@techgadgets.com", phone: "+1-555-1001", address: "123 Tech Street, Silicon Valley, CA", status: "active", joinDate: "2023-01-15", rating: 4.8 },
        { id: 2, name: "Fashion Forward", email: "sales@fashionforward.com", phone: "+1-555-1002", address: "456 Fashion Ave, New York, NY", status: "active", joinDate: "2023-02-20", rating: 4.6 },
        { id: 3, name: "Sports Zone", email: "info@sportszone.com", phone: "+1-555-1003", address: "789 Athletic Blvd, Denver, CO", status: "active", joinDate: "2023-03-10", rating: 4.7 },
        { id: 4, name: "Home Essentials", email: "orders@homeessentials.com", phone: "+1-555-1004", address: "321 Home Lane, Chicago, IL", status: "active", joinDate: "2023-04-05", rating: 4.5 },
        { id: 5, name: "Audio World", email: "support@audioworld.com", phone: "+1-555-1005", address: "654 Sound Street, Nashville, TN", status: "inactive", joinDate: "2023-05-12", rating: 4.3 },
        { id: 6, name: "Book Haven", email: "contact@bookhaven.com", phone: "+1-555-1006", address: "987 Literature Lane, Boston, MA", status: "active", joinDate: "2023-06-18", rating: 4.9 }
    ],
    admins: [
        { id: 1, name: "Admin User", email: "admin@example.com", password: "admin123", role: "superadmin", status: "active", lastLogin: "2025-01-18", permissions: ["all"] },
        { id: 2, name: "John Manager", email: "john.manager@example.com", password: "manager456", role: "manager", status: "active", lastLogin: "2025-01-17", permissions: ["products", "sellers", "customers"] },
        { id: 3, name: "Sarah Editor", email: "sarah.editor@example.com", password: "editor789", role: "editor", status: "active", lastLogin: "2025-01-16", permissions: ["products", "categories"] },
        { id: 4, name: "Mike Support", email: "mike.support@example.com", password: "support321", role: "support", status: "inactive", lastLogin: "2025-01-10", permissions: ["inbox", "customers"] }
    ],
    currentAdmin: {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123"
    },
    dashboardStats: {}
};

// Generate unique IDs for new items
function generateId(section) {
    const existingIds = dataStore[section].map(item => item.id);
    return Math.max(...existingIds, 0) + 1;
}

// Helper function to get seller name by ID
function getSellerNameById(sellerId) {
    const seller = dataStore.sellers.find(s => s.id === sellerId);
    return seller ? seller.name : 'Unknown Seller';
}

// Helper function to get seller by ID
function getSellerById(sellerId) {
    return dataStore.sellers.find(s => s.id === sellerId);
}

// Helper function to get products by seller ID
function getProductsBySeller(sellerId) {
    return dataStore.products.filter(p => p.sellerId === sellerId);
}

// Helper function to get categories by seller ID
function getCategoriesBySeller(sellerId) {
    return dataStore.categories.filter(c => c.sellerId === sellerId);
}

function calculateDashboardStats() {
    dataStore.dashboardStats = {
        totalSellers: dataStore.sellers.length,
        totalCustomers: dataStore.customers.length,
        totalProducts: dataStore.products.length,
        totalCategories: dataStore.categories.length,
        recentOrders: [...dataStore.sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    };
}

const appState = {
    currentSection: 'dashboard',
    currentFilter: 'all',
    currentSort: { field: 'name', direction: 'asc' },
    searchQuery: '',
    editingItem: null,
    currentPage: 1,
    itemsPerPage: 5,
    unreadVerifications: 3,
    unreadMessages: 5,
    selectedItems: new Set(),
    selectAll: false,
    isPasswordConfirmed: false,
    filterBySeller: null, // New property to filter by seller
    currentMessageSeller: null // Current seller being messaged
};

calculateDashboardStats();