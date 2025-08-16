// Sample data for different sections
const dataStore = {
    products: [
        { id: 1, name: "Wireless Headphones", category: "Electronics", price: 99.99, stock: 45, status: "active", description: "High-quality wireless headphones with noise cancellation." },
        { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 12, status: "active", description: "Latest smart watch with fitness tracking and notifications." },
        { id: 3, name: "Cotton T-Shirt", category: "Clothing", price: 24.99, stock: 78, status: "active", description: "Comfortable 100% cotton t-shirt available in multiple colors." },
        { id: 4, name: "Coffee Maker", category: "Home & Kitchen", price: 49.99, stock: 5, status: "low-stock", description: "Automatic drip coffee maker with programmable timer." },
        { id: 5, name: "Bluetooth Speaker", category: "Electronics", price: 79.99, stock: 0, status: "inactive", description: "Portable Bluetooth speaker with 20-hour battery life." },
        { id: 6, name: "Leather Wallet", category: "Accessories", price: 34.99, stock: 23, status: "active", description: "Genuine leather wallet with multiple card slots." },
        { id: 7, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 34, status: "active", description: "Non-slip yoga mat with carrying strap." },
        { id: 8, name: "Cookbook", category: "Books", price: 19.99, stock: 7, status: "low-stock", description: "Best-selling cookbook with 100+ recipes." },
        { id: 9, name: "Desk Lamp", category: "Home & Kitchen", price: 39.99, stock: 15, status: "active", description: "Adjustable LED desk lamp with touch controls." },
        { id: 10, name: "Backpack", category: "Accessories", price: 59.99, stock: 20, status: "active", description: "Durable backpack with laptop compartment." },
        { id: 11, name: "Wireless Mouse", category: "Electronics", price: 29.99, stock: 42, status: "active", description: "Ergonomic wireless mouse with silent clicks." },
        { id: 12, name: "Water Bottle", category: "Fitness", price: 14.99, stock: 3, status: "low-stock", description: "Insulated stainless steel water bottle." }
    ],
    categories: [
        { id: 1, name: "Electronics", description: "Electronic devices and accessories", productCount: 45, status: "active" },
        { id: 2, name: "Clothing", description: "Apparel and fashion items", productCount: 128, status: "active" },
        { id: 3, name: "Home & Kitchen", description: "Home appliances and kitchenware", productCount: 76, status: "active" },
        { id: 4, name: "Books", description: "Books and educational materials", productCount: 32, status: "active" },
        { id: 5, name: "Toys", description: "Toys and games", productCount: 18, status: "inactive" }
    ],
    customers: [
        { id: 1, name: "John Smith", email: "john@example.com", phone: "555-1234", orders: 5, totalSpent: 1245.99, status: "active" },
        { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "555-5678", orders: 12, totalSpent: 3245.50, status: "active" },
        { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "555-9012", orders: 2, totalSpent: 199.99, status: "inactive" },
        { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "555-3456", orders: 8, totalSpent: 876.75, status: "active" }
    ],
    sales: [
        { id: 1001, date: "2023-05-15", customer: "John Smith", amount: 199.99, status: "completed", items: 2 },
        { id: 1002, date: "2023-05-16", customer: "Sarah Johnson", amount: 345.50, status: "completed", items: 3 },
        { id: 1003, date: "2023-05-17", customer: "Michael Brown", amount: 99.99, status: "pending", items: 1 },
        { id: 1004, date: "2023-05-18", customer: "Emily Davis", amount: 176.75, status: "completed", items: 4 }
    ],
    notifications: [
        { id: 1, title: "New Order Received", message: "Order #1005 from David Wilson", date: "2023-05-20 09:30", status: "unread", type: "order" },
        { id: 2, title: "Low Stock Alert", message: "Only 3 Water Bottles left in stock", date: "2023-05-20 08:15", status: "unread", type: "inventory" },
        { id: 3, title: "System Update Available", message: "New version v2.3.1 is ready to install", date: "2023-05-19 16:45", status: "read", type: "system" },
        { id: 4, title: "Payment Received", message: "Payment of $199.99 for Order #1001", date: "2023-05-19 14:20", status: "read", type: "payment" },
        { id: 5, title: "Urgent: Server Maintenance", message: "Scheduled maintenance tonight at 2 AM", date: "2023-05-18 11:10", status: "unread", type: "urgent" }
    ],
    sellers: [
        {
            id: 1,
            name: "Tech Gadgets Inc.",
            email: "contact@techgadgets.com",
            password: "tech123",
            products: ["Wireless Headphones", "Smart Watch", "Bluetooth Speaker"],
            categories: ["Electronics", "Accessories"],
            status: "active"
        },
        {
            id: 2,
            name: "Fashion World",
            email: "info@fashionworld.com",
            password: "fashion456",
            products: ["Cotton T-Shirt", "Leather Wallet"],
            categories: ["Clothing", "Accessories"],
            status: "active"
        }
    ]
};

// Current state of the application
const appState = {
    currentSection: 'products',
    currentFilter: 'all',
    currentSort: { field: 'name', direction: 'asc' },
    searchQuery: '',
    editingItem: null,
    currentPage: 1,
    itemsPerPage: 5,
    unreadNotifications: 3,
    selectedItems: new Set(),
    selectAll: false
};