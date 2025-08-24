// Seeder.js - Optimized for speed by directly manipulating data
import { Auth } from "../utils/auth.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Admin } from "../models/Admin.js";
import { Seller } from "../models/Seller.js";
import { Customer } from "../models/Customer.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
function encodeUnicode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}
export class Seeder {
    static async run() {
        console.log("🚀 Starting Kajwelo Seeding Process...");
        Storage.clear();

        // ---------- 1. CREATE 5 ADMINS ----------
        console.log("\n📋 Step 1: Creating 5 Admins...");
        const adminData = [
            { name: "Abdullah Ragab", email: "abdullah@kajwelo.org", pass: encodeUnicode("Admin@123"), adminLevel: 3 },
            { name: "Haidy Mohammed", email: "haidy@kajwelo.org", pass: encodeUnicode("Admin@123"), adminLevel: 1 },
            { name: "Mohammed Mekkawi", email: "mekkawi@kajwelo.org", pass: encodeUnicode("Admin@123"), adminLevel: 1 },
            { name: "Rahma Salah", email: "rahma@kajwelo.org", pass: encodeUnicode("Admin@123"), adminLevel: 2 },
            { name: "Sohila Mohammed", email: "sohila@kajwelo.org", pass: encodeUnicode("Admin@123"), adminLevel: 2 },
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
                encodeUnicode("Seller@123"),
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
                    image: `../assets/products/${subcategory == "Polo Shirts" ? "Polo-Shirts" : subcategory}.jpg`,
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
                encodeUnicode("Cust@123"),
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

        // ---------- 9. INITIATE MESSAGES BETWEEN USERS ----------
        console.log("\n💬 Step 9: Initiating Messages Between Users...");
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

        // ---------- 10. SAVE ALL DATA TO LOCALSTORAGE ----------
        console.log("\n💾 Step 10: Saving Data to LocalStorage...");
        Storage.set("users", users);

        // ---------- 11. CREATE ORDERS THROUGH PROPER CHECKOUT PROCESS ----------
        console.log("\n📦 Step 11: Creating Orders Through Proper Checkout Process...");

        // Get confirmed customers only
        const confirmedCustomers = customers.filter(c => c.isConfirmed);

        // Pre-cache all valid products for faster access
        const validProductsCache = allVisibleProducts.map(product => ({
            ...product,
            availableVariants: product.stock.filter(variant => variant.quantity > 0)
        })).filter(product => product.availableVariants.length > 0);

        console.log(`📊 Found ${validProductsCache.length} products with available stock`);

        let totalOrdersCreated = 0;
        let totalEarningsGenerated = 0;

        // Batch process orders for better performance
        const allOrders = [];

        confirmedCustomers.forEach((customer, customerIndex) => {
            // Create 3-5 orders per customer
            const numOrders = Math.floor(Math.random() * 3) + 3; // 3-5 orders

            for (let orderIndex = 0; orderIndex < numOrders; orderIndex++) {
                // Create a new order using the Order class
                const order = {
                    orderId: crypto.randomUUID(),
                    customerId: customer.id,
                    products: [],
                    totalPrice: 0,
                    status: "Checked Out - Waiting to be Shipped",
                    orderedAt: new Date(),
                    shippingFee: 0,
                    class: "order"
                };

                // Add 1-3 products to the order
                const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products
                const randomProducts = validProductsCache.sort(() => 0.5 - Math.random()).slice(0, numProducts);

                let productsAdded = 0;
                randomProducts.forEach(product => {
                    if (product.availableVariants.length > 0) {
                        const randomVariant = product.availableVariants[Math.floor(Math.random() * product.availableVariants.length)];
                        const quantity = Math.floor(Math.random() * Math.min(3, randomVariant.quantity)) + 1;

                        // Directly add product to order (bypassing slow addProduct method)
                        order.products.push({
                            productId: product.id,
                            size: randomVariant.size,
                            color: randomVariant.color,
                            quantity: quantity
                        });

                        // Update order total price
                        order.totalPrice += (product.price * quantity);

                        productsAdded++;
                    }
                });

                // Only proceed with checkout if products were added successfully
                if (productsAdded > 0) {
                    // Add order to customer's order history
                    customer.orderHistory.push(order);

                    // Store order for batch processing
                    allOrders.push({
                        order: order,
                        customer: customer
                    });

                    totalOrdersCreated++;
                    totalEarningsGenerated += order.totalPrice;
                }
            }

            // Show progress every 2 customers
            if ((customerIndex + 1) % 2 === 0 || customerIndex === confirmedCustomers.length - 1) {
                console.log(`✅ Processed ${customerIndex + 1}/${confirmedCustomers.length} customers (${totalOrdersCreated} orders created)`);
            }
        });

        // Batch process seller earnings and inventory updates
        console.log(`\n🔄 Processing seller earnings and inventory updates...`);

        // Create a map for faster seller lookups
        const sellerMap = new Map();
        verifiedSellers.forEach(seller => {
            sellerMap.set(seller.id, seller);
        });

        // Process all orders in batch
        allOrders.forEach(({ order, customer }) => {
            order.products.forEach(orderedProduct => {
                // Find the product and seller
                const product = validProductsCache.find(p => p.id === orderedProduct.productId);
                if (product) {
                    const seller = sellerMap.get(product.sellerId);
                    if (seller) {
                        // Update seller earnings
                        seller.earnings += product.price * orderedProduct.quantity;

                        // Create seller order copy
                        const sellerOrder = {
                            orderId: order.orderId,
                            customerId: customer.id,
                            products: [...order.products],
                            totalPrice: order.totalPrice,
                            status: order.status,
                            orderedAt: order.orderedAt,
                            shippingFee: order.shippingFee,
                            class: "order"
                        };

                        // Add to seller's orders
                        seller.orders.push(sellerOrder);

                        // Update product inventory
                        const sellerProduct = seller.products.find(p => p.id === product.id);
                        if (sellerProduct) {
                            sellerProduct.stock.forEach(variant => {
                                if (variant.size === orderedProduct.size && variant.color === orderedProduct.color) {
                                    variant.quantity -= orderedProduct.quantity;

                                    // Remove variant if out of stock
                                    if (variant.quantity <= 0) {
                                        sellerProduct.stock = sellerProduct.stock.filter(v =>
                                            !(v.size === variant.size && v.color === variant.color)
                                        );

                                        // Update available colors and sizes
                                        const remainingColors = [...new Set(sellerProduct.stock.map(v => v.color))];
                                        const remainingSizes = [...new Set(sellerProduct.stock.map(v => v.size))];

                                        sellerProduct.availableColors = remainingColors;
                                        sellerProduct.availableSizes = remainingSizes;
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });

        console.log(`\n🎉 Order Creation Complete!`);
        console.log(`📦 Total Orders: ${totalOrdersCreated}`);
        console.log(`💰 Total Revenue: EGP ${totalEarningsGenerated.toFixed(2)}`);

        // ---------- 12. UPDATE ALL USERS IN STORAGE ----------
        console.log("\n💾 Step 12: Updating All Users in Storage...");
        Storage.set("users", users);

        // ---------- 13. PRINT USERS TABLE ----------
        console.log("\n🚪 Step 13: Printing Users Table...");
        console.table(users.map(u => ({
            Name: u.name,
            Role: u.role,
            Email: u.email,
            Confirmed: u.isConfirmed ? "✅" : "❌",
            Verified: u.isVerified ? "✅" : "❌",
            Products: u.role === "seller" ? u.products?.length || 0 : "-",
            Orders: u.role === "customer" ? u.orderHistory?.length || 0 : "-",
            Earnings: u.role === "seller" ? `EGP ${u.earnings?.toFixed(2) || "0.00"}` : "-",
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

        // Calculate total orders and earnings
        const totalOrders = customers.reduce((sum, c) => sum + (c.orderHistory?.length || 0), 0);
        const totalEarnings = sellers.reduce((sum, s) => sum + (s.earnings || 0), 0);

        console.log(`📦 Total Orders Created: ${totalOrders}`);
        console.log(`💰 Total Seller Earnings: EGP ${totalEarnings.toFixed(2)}`);

        // Return completion status
        return {
            success: true,
            message: "Seeding completed successfully",
            totalUsers: users.length,
            totalAdmins: users.filter(u => u instanceof Admin).length,
            totalSellers: users.filter(u => u instanceof Seller).length,
            totalCustomers: users.filter(u => u instanceof Customer).length,
            totalOrders: totalOrders,
            totalEarnings: totalEarnings
        };
    }
}
