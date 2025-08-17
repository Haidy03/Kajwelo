// Seeder.js
import { Auth } from "../utils/auth.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Admin } from "../models/Admin.js";
import { Seller } from "../models/Seller.js";
import { Customer } from "../models/Customer.js";
import { Conversation } from "../models/Conversation.js";
import { User } from "../models/User.js";

export class Seeder {
    static run() {
        Storage.clear();
        let users;

        // ---------- 1. ADMINS ----------
        const adminData = [
            { name: "Abdullah Ragab", email: "abdullah@kajwelo.org", pass: "Admin@123", adminLevel: 3 },
            { name: "Haidy Mohammed", email: "haidy@kajwelo.org", pass: "Admin@124", adminLevel: 1 },
            { name: "Mohammed Mekkawi", email: "mekkawi@kajwelo.org", pass: "Admin@125", adminLevel: 1 },
            { name: "Rahma Salah", email: "rahma@kajwelo.org", pass: "Admin@126", adminLevel: 2 },
            { name: "Sohila Mohammed", email: "sohila@kajwelo.org", pass: "Admin@127", adminLevel: 2 },
        ];

        adminData.forEach(a => {
            Auth.register({ name: a.name, email: a.email, password: a.pass, role: "admin", adminLevel: a.adminLevel });
        });

        users = Storage.get("users", []);
        users.forEach(u => { if (u instanceof Admin) u.isConfirmed = true; });
        Storage.set("users", users);

        let admins = Storage.get("users", []).filter(u => u instanceof Admin);
        const superAdmin = admins.find(a => a.adminLevel === 3);

        // ---------- 2. SELLERS ----------
        const sellerBrands = [
            "UrbanWear", "StreetStyle", "ClassyFit", "DenimHouse", "CozyCloth",
            "EliteFashion", "BoldThreads", "ChicWardrobe", "FreshLooks", "TrendWave"
        ];

        sellerBrands.forEach((brand, i) => {
            Auth.register({
                name: `${brand} Owner`,
                email: `${brand.toLowerCase()}@shop.com`,
                password: "Seller@123",
                role: "seller",
                brandName: brand,
                address: `Cairo Branch ${i + 1}`,
                phone: `0100${i}223344`
            });
        });

        users = Storage.get("users", []);
        let sellers = users.filter(u => u instanceof Seller);

        // ✅ Step 1: Verify 7 sellers first
        sellers.slice(0, 7).forEach(seller => {
            const res = superAdmin.verifyBrand(seller.id);
        });
        //Storage.set("users", users);

        // ---------- 3. PRODUCTS ----------
        users = Storage.get("users", []);
        sellers = users.filter(u => u instanceof Seller);
        const categories = ["Men", "Women"];
        const subcategories = ["Shirt", "Pants", "Hoodie", "Skirt", "Jacket", "Shoes"];
        const colors = ["black", "white", "blue", "red", "green", "gray"];
        const sizes = ["S", "M", "L", "XL"];

        let productCount = 0;
        sellers.slice(0, 7).forEach(seller => {
            // ✅ Login as this verified seller
            Auth.login(seller.email, "Seller@123");

            for (let i = 0; i < 15; i++) {
                const sub = subcategories[Math.floor(Math.random() * subcategories.length)];
                const cat = categories[Math.floor(Math.random() * categories.length)];
                const name = `${cat} ${sub} #${productCount + 1}`;
                const image = `https://source.unsplash.com/200x200/?clothes,${sub.toLowerCase()}`;

                const productData = {
                    name,
                    description: `High quality ${sub.toLowerCase()} for ${cat}.`,
                    price: (Math.floor(Math.random() * 50) + 20) * 10,
                    category: cat,
                    subcategory: sub,
                    availableColors: colors.slice(0, 3),
                    availableSizes: sizes.slice(0, 3),
                    stock: [
                        { size: "M", color: "black", quantity: 10 },
                        { size: "L", color: "blue", quantity: 5 }
                    ],
                    image
                };

                let result = seller.addProduct(productData);
                productCount++;
            }
        });

        users = Storage.get("users", []);
        sellers = users.filter(u => u instanceof Seller);

        // ✅ Step 2: Verify products (leave 2 pending per seller)
        sellers.slice(0, 7).forEach(seller => {
            seller.products.forEach((p, idx) => {
                if (idx < seller.products.length - 2) {
                    const r = superAdmin.verifyProduct(seller.id, p.id);
                    //console.log(r.message)
                }
            });
        });

        //Storage.set("users", users);

        // ---------- 4. CUSTOMERS ----------
        for (let i = 0; i < 10; i++) {
            Auth.register({
                name: `Customer ${i + 1}`,
                email: `customer${i + 1}@mail.com`,
                password: "Cust@123",
                role: "customer",
                gender: i % 2 === 0 ? "Male" : "Female",
                address: `Customer Address ${i + 1}`,
                phone: `0111${i}778899`
            });
        }

        users = Storage.get("users", []);
        sellers = users.filter(u => u instanceof Seller);
        let customers = users.filter(u => u instanceof Customer);

        const allProducts = []

        sellers.forEach(s => {
            s.products.forEach(p => { if (p.isVerified) allProducts.push(p); })
        });
        customers.slice(0, 8).forEach(c => {
            const picks = allProducts.sort(() => 0.5 - Math.random()).slice(0, 5);
            picks.forEach(p => {
                const r1 = c.addToWishlist(p);
                const r2 = c.addToCart(p);
            });
        });

        Storage.set("users", users);

        // ---------- 5. MESSAGES ----------
        users = Storage.get("users", []);
        admins = users.filter(u => u instanceof Admin);
        sellers = users.filter(u => u instanceof Seller);
        customers = users.filter(u => u instanceof Customer);

        // Seller <-> Admin
        let seller1 = sellers[0];
        Auth.login(seller1.email, "Seller@123");
        Conversation.send("Please verify my new hoodie", superAdmin.id);

        // Customer <-> Admin
        let customer1 = customers[0];
        Auth.login(customer1.email, "Cust@123");
        Conversation.send("I need help with checkout", superAdmin.id);

        // Customer <-> Seller
        let randomCustomer = customers[1];
        let randomSeller = sellers[1];
        Auth.login(randomCustomer.email, "Cust@123");
        Conversation.send("Do you have this jacket in XL?", randomSeller.id);

        // reset to super admin
        Auth.login(superAdmin.email, "Admin@123");

        // ---------- 6. TABLE ----------
        console.table(users.map(u => ({
            name: u.name,
            role: u.role,
            email: u.email,
            products: u.role === "seller" ? u.products?.length || 0 : "-",
            wishlist: u.role === "customer" ? u.wishlist?.length || 0 : "-",
            cart: u.role === "customer" ? u.cart?.length || 0 : "-",
            password: (u.role === "admin"
                ? "Admin@123-127 range"
                : u.role === "seller"
                    ? "Seller@123"
                    : "Cust@123")
        })));
    }
}

