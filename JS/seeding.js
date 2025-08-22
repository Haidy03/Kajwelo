// Seeder.js - Optimized for speed by directly manipulating data
import { Auth } from "../utils/auth.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Admin } from "../models/Admin.js";
import { Seller } from "../models/Seller.js";
import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

export class Seeder {
    static async run() {
        console.log("🚀 Starting Kajwelo Seeding Process...");
        Storage.clear();
        
        // ---------- 1. CREATE 5 ADMINS ----------
        console.log("\n📋 Step 1: Creating 5 Admins...");
        const adminData = [
            { name: "Abdullah Ragab", email: "abdullah@kajwelo.org", pass: "Admin@123", adminLevel: 3 },
            { name: "Haidy Mohammed", email: "haidy@kajwelo.org", pass: "Admin@124", adminLevel: 1 },
            { name: "Mohammed Mekkawi", email: "mekkawi@kajwelo.org", pass: "Admin@125", adminLevel: 1 },
            { name: "Rahma Salah", email: "rahma@kajwelo.org", pass: "Admin@126", adminLevel: 2 },
            { name: "Sohila Mohammed", email: "sohila@kajwelo.org", pass: "Admin@127", adminLevel: 2 },
        ];

        const users = [];
        adminData.forEach(a => {
            const admin = new Admin(a.name, a.email, a.pass, { adminLevel: a.adminLevel });
            admin.isConfirmed = true;
            users.push(admin);
        });

        // ---------- 2. CREATE 10 SELLERS WITH MODERN BRAND NAMES ----------
        console.log("\n🏪 Step 2: Creating 10 Sellers with Modern Brand Names...");
        const modernBrandNames = [
            "Nova", "Zenith", "Pulse", "Echo", "Vibe", 
            "Flux", "Nexus", "Prism", "Orbit", "Spark"
        ];

        modernBrandNames.forEach((brand, i) => {
            const seller = new Seller(
                `${brand} Fashion`,
                `${brand.toLowerCase()}@fashion.com`,
                "Seller@123",
                {
                    brandName: brand,
                    address: `Cairo Fashion District ${i + 1}`,
                    phone: `0100${i}223344`,
                    targetAudience: i % 2 === 0 ? "Men" : "Women"
                }
            );
            seller.isConfirmed = true;
            users.push(seller);
        });

        // ---------- 3. VERIFY 8 BRANDS ----------
        console.log("\n✅ Step 3: Verifying 8 Brands...");
        const sellers = users.filter(u => u instanceof Seller);
        sellers.slice(0, 8).forEach(seller => {
            seller.isVerified = true;
            console.log(`Verified ${seller.brandName}`);
        });

        // ---------- 4. ADD 20 PRODUCTS FOR EACH VERIFIED BRAND ----------
        console.log("\n🛍️ Step 4: Adding 20 Products for Each Verified Brand...");
        const categories = ["Men", "Women"];
        const menSubcategories = ["Suits", "Shirts", "Trousers", "Polo Shirts", "T-Shirts", "Shorts"];
        const womenSubcategories = ["Dresses", "Skirts", "Blouses", "Cardigans", "Pants", "Sets"];
        const colors = ["Black", "White", "Blue", "Red", "Green", "Gray", "Navy", "Brown"];
        const sizes = ["S", "M", "L", "XL", "2XL"];
        const tags = ["New", "Best Seller", "Featured", "Trending", "Limited Edition"];
        const descriptions = [
            "Premium quality fabric with perfect fit",
            "Comfortable and stylish design",
            "Modern cut with attention to detail",
            "Versatile piece for any occasion",
            "High-end material with excellent durability"
        ];

        const verifiedSellers = users.filter(u => u instanceof Seller && u.isVerified);
        
        verifiedSellers.forEach((seller, sellerIndex) => {
            console.log(`Adding products for ${seller.brandName}...`);
            
            for (let i = 0; i < 20; i++) {
                const category = categories[Math.floor(Math.random() * categories.length)];
                const subcategory = category === "Men" 
                    ? menSubcategories[Math.floor(Math.random() * menSubcategories.length)]
                    : womenSubcategories[Math.floor(Math.random() * womenSubcategories.length)];
                
                const productName = `${seller.brandName} ${subcategory} ${i + 1}`;
                const basePrice = Math.floor(Math.random() * 300) + 100;
                const salePrice = Math.random() > 0.7 ? Math.floor(basePrice * 0.8) : null;
                
                // Generate stock variants
                const availableColors = colors.slice(0, Math.floor(Math.random() * 4) + 2);
                const availableSizes = sizes.slice(0, Math.floor(Math.random() * 3) + 2);
                const stock = [];
                
                availableColors.forEach(color => {
                    availableSizes.forEach(size => {
                        stock.push({
                            size: size,
                            color: color,
                            quantity: Math.floor(Math.random() * 20) + 5
                        });
                    });
                });

                const product = {
                    id: crypto.randomUUID(),
                    sellerId: seller.id,
                    name: productName,
                    description: descriptions[Math.floor(Math.random() * descriptions.length)],
                    price: basePrice,
                    salePrice: salePrice,
                    category: category,
                    subcategory: subcategory,
                    availableColors: availableColors,
                    availableSizes: availableSizes,
                    stock: stock,
                    tags: [tags[Math.floor(Math.random() * tags.length)]],
                    image: `../assets/products/${subcategory}.jpg`,
                    isVerified: true,
                    visibility: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    class: "product"
                };

                seller.products.push(product);
            }
        });

        // ---------- 5. VERIFY 15 PRODUCTS PER SELLER ----------
        console.log("\n✅ Step 5: Verifying 15 Products per Seller...");
        verifiedSellers.forEach(seller => {
            seller.products.forEach((product, idx) => {
                if (idx < 15) {
                    product.isVerified = true;
                    console.log(`Verified ${product.name}`);
                }
            });
        });

        // ---------- 6. SHOW 12 PRODUCTS, HIDE 3 ----------
        console.log("\n👁️ Step 6: Sellers Showing 12 Products, Hiding 3...");
        verifiedSellers.forEach(seller => {
            seller.products.forEach((product, idx) => {
                if (product.isVerified) {
                    if (idx < 12) {
                        product.visibility = true;
                        console.log(`Showed ${product.name}`);
                    } else {
                        product.visibility = false;
                        console.log(`Hidden ${product.name}`);
                    }
                }
            });
        });

        // ---------- 7. CREATE 10 CUSTOMERS ----------
        console.log("\n👥 Step 7: Creating 10 Customers...");
        for (let i = 0; i < 10; i++) {
            const customer = new Customer(
                `Customer ${i + 1}`,
                `customer${i + 1}@mail.com`,
                "Cust@123",
                {
                    gender: i % 2 === 0 ? "Male" : "Female",
                    address: `Customer Address ${i + 1}`,
                    phone: `0111${i}778899`
                }
            );
            customer.isConfirmed = i < 7; // Confirm first 7 customers
            users.push(customer);
        }

        // ---------- 8. ADD PRODUCTS TO CUSTOMER CART/WISHLIST ----------
        console.log("\n🛒 Step 8: Adding Products to Customer Cart/Wishlist...");
        const customers = users.filter(u => u instanceof Customer);
        
        // Get all visible products
        const allVisibleProducts = [];
        verifiedSellers.forEach(seller => {
            seller.products.forEach(product => {
                if (product.isVerified && product.visibility) {
                    allVisibleProducts.push(product);
                }
            });
        });

        customers.forEach(customer => {
            const numProducts = Math.floor(Math.random() * 6); // 0-5 products
            const randomProducts = allVisibleProducts.sort(() => 0.5 - Math.random()).slice(0, numProducts);
            
            randomProducts.forEach(product => {
                // Randomly add to cart or wishlist
                if (Math.random() > 0.5) {
                    customer.cart.push(product);
                } else {
                    customer.wishlist.push(product);
                }
            });
        });

        // ---------- 9. CREATE 5 ORDERS PER CUSTOMER ----------
        console.log("\n📦 Step 9: Creating 5 Orders per Customer...");
        customers.forEach(customer => {
            for (let i = 0; i < 5; i++) {
                const order = {
                    orderId: crypto.randomUUID(),
                    class: "Order",
                    orderedAt: new Date(),
                    products: [],
                    shippingFee: 0,
                    totalPrice: 0,
                    customerId: customer.id,
                    status: "waiting to be Checked Out"
                };
                
                const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products
                const randomProducts = allVisibleProducts.sort(() => 0.5 - Math.random()).slice(0, numProducts);
                
                randomProducts.forEach(product => {
                    const randomVariant = product.stock[Math.floor(Math.random() * product.stock.length)];
                    if (randomVariant && randomVariant.quantity > 0) {
                        order.products.push({
                            productId: product.id,
                            size: randomVariant.size,
                            color: randomVariant.color,
                            quantity: 1
                        });
                        order.totalPrice += product.price;
                    }
                });
                
                if (order.products.length > 0) {
                    customer.orderHistory.push(order);
                }
            }
        });

        // ---------- 10. INITIATE MESSAGES BETWEEN USERS ----------
        console.log("\n💬 Step 10: Initiating Messages Between Users...");
        const admins = users.filter(u => u instanceof Admin);
        const superAdmin = admins.find(a => a.adminLevel === 3);

        // Create some sample conversations
        customers.slice(0, 3).forEach(customer => {
            const conversation = {
                participants: { sender: customer.id, reciever: superAdmin.id },
                messages: [
                    {
                        sender: customer.id,
                        content: "I need help with my order",
                        sentAt: new Date(),
                        readAt: null,
                        status: false,
                        class: "message"
                    },
                    {
                        sender: superAdmin.id,
                        content: "How can I help you with your order?",
                        sentAt: new Date(),
                        readAt: null,
                        status: false,
                        class: "message"
                    }
                ],
                updatedAt: new Date(),
                class: "conversation"
            };
            
            customer.chats.push(conversation);
            superAdmin.chats.push(conversation);
        });

        verifiedSellers.slice(0, 3).forEach(seller => {
            const conversation = {
                participants: { sender: seller.id, reciever: superAdmin.id },
                messages: [
                    {
                        sender: seller.id,
                        content: "Please review my new product collection",
                        sentAt: new Date(),
                        readAt: null,
                        status: false,
                        class: "message"
                    },
                    {
                        sender: superAdmin.id,
                        content: "I'll review your products soon",
                        sentAt: new Date(),
                        readAt: null,
                        status: false,
                        class: "message"
                    }
                ],
                updatedAt: new Date(),
                class: "conversation"
            };
            
            seller.chats.push(conversation);
            superAdmin.chats.push(conversation);
        });

        // ---------- 11. SAVE ALL DATA TO LOCALSTORAGE ----------
        console.log("\n💾 Step 11: Saving Data to LocalStorage...");
        Storage.set("users", users);

        // ---------- 12. PRINT USERS TABLE ----------
        console.log("\n🚪 Step 12: Printing Users Table...");
        console.table(users.map(u => ({
            Name: u.name,
            Role: u.role,
            Email: u.email,
            Confirmed: u.isConfirmed ? "✅" : "❌",
            Verified: u.isVerified ? "✅" : "❌",
            Products: u.role === "seller" ? u.products?.length || 0 : "-",
            Orders: u.role === "customer" ? u.orderHistory?.length || 0 : "-",
            Wishlist: u.role === "customer" ? u.wishlist?.length || 0 : "-",
            Cart: u.role === "customer" ? u.cart?.length || 0 : "-",
            Password: (u.role === "admin"
                ? "Admin@123-127 range"
                : u.role === "seller"
                    ? "Seller@123"
                    : "Cust@123")
        })));

        console.log("\n🎉 Seeding completed successfully!");
        console.log(`📈 Total Users: ${users.length}`);
        console.log(`👨‍💼 Admins: ${users.filter(u => u instanceof Admin).length}`);
        console.log(`🏪 Sellers: ${users.filter(u => u instanceof Seller).length}`);
        console.log(`👥 Customers: ${users.filter(u => u instanceof Customer).length}`);

        // Return completion status
        return {
            success: true,
            message: "Seeding completed successfully",
            totalUsers: users.length,
            totalAdmins: users.filter(u => u instanceof Admin).length,
            totalSellers: users.filter(u => u instanceof Seller).length,
            totalCustomers: users.filter(u => u instanceof Customer).length
        };
    }
}

