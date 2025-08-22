import { retrive } from "./Filteration.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Seller } from "./Seller.js";
import { User } from "./User.js";

export class Order {
    constructor(customerId) {
        this.orderId = crypto.randomUUID();
        this.class = "Order";
        this.orderedAt = new Date();
        this.products = [];
        this.shippingFee = 0;
        this.totalPrice = 0;
        this.customerId = customerId;
        this.status = "waiting to be Checked Out"
    }

    addProduct(productId, size, color, quantity) {
        const result = retrive.allValidProducts();
        const allValidProducts = result.products;
        const targetedProduct = allValidProducts.find(product => product.id === productId);
        let res = {};
        if (targetedProduct) {
            const index = targetedProduct.stock.findIndex(variant => variant["color"] === color && variant["size"] === size && variant["quantity"] >= quantity)
            if (index !== -1) {
                this.products.push({ productId: targetedProduct.id, size: size, color: color, quantity: quantity })
                this.totalPrice += (targetedProduct.price * quantity) + this.shippingFee
                res = { success: true, message: "Added Successfully" }
            } else {
                res = { success: false, message: "Out Of Stock" }
            }

            return res
        }

        res = { success: false, message: "Product Wasn't Found" }
        return res
    }

    updateSellersEarning() {
        // Get all users and products once
        const users = Storage.get("users", []);
        const result = retrive.allValidProducts();
        const allValidProducts = result.products;
        
        if (allValidProducts.length === 0) return;
        
        // Create maps for O(1) lookups instead of nested loops
        const productMap = new Map();
        const sellerMap = new Map();
        
        // Build product map for fast product lookups
        allValidProducts.forEach(product => {
            productMap.set(product.id, product);
        });
        
        // Build seller map for fast seller lookups
        users.forEach(user => {
            if (user instanceof Seller) {
                sellerMap.set(user.id, user);
            }
        });
        
        // Process each ordered product
        this.products.forEach(orderedProduct => {
            // Find product using map (O(1) instead of O(n))
            const fullProduct = productMap.get(orderedProduct.productId);
            if (!fullProduct) return;
            
            // Find seller using map (O(1) instead of O(n))
            const seller = sellerMap.get(fullProduct.sellerId);
            if (!seller) return;
            
            // Update seller earnings
            seller.earnings += fullProduct.price * orderedProduct.quantity;
            
            // Create seller order copy
            const sellerOrder = {
                orderId: this.orderId,
                customerId: this.customerId,
                products: [...this.products],
                totalPrice: this.totalPrice,
                status: this.status,
                orderedAt: this.orderedAt,
                shippingFee: this.shippingFee,
                class: "Order"
            };
            
            // Add to seller's orders
            seller.orders.push(sellerOrder);
            
            // Find and update the specific product in seller's inventory
            const sellerProduct = seller.products.find(p => p.id === fullProduct.id);
            if (sellerProduct) {
                // Find the specific stock variant
                const variant = sellerProduct.stock.find(v => 
                    v.size === orderedProduct.size && v.color === orderedProduct.color
                );
                
                if (variant) {
                    // Update quantity
                    variant.quantity -= orderedProduct.quantity;
                    
                    // Remove variant if out of stock
                    if (variant.quantity <= 0) {
                        sellerProduct.stock = sellerProduct.stock.filter(v => 
                            !(v.size === variant.size && v.color === variant.color)
                        );
                        
                        // Update available colors and sizes using Set for efficiency
                        const remainingColors = new Set(sellerProduct.stock.map(v => v.color));
                        const remainingSizes = new Set(sellerProduct.stock.map(v => v.size));
                        
                        sellerProduct.availableColors = Array.from(remainingColors);
                        sellerProduct.availableSizes = Array.from(remainingSizes);
                    }
                }
            }
            
            // Update seller in database
            User.updateInDB(seller);
        });
    }
}


// const order = {
//     orderId: crypto.randomUUID();
//     orderedAt : new Date()
//     products: [{productId,size,color,quantity}]
//     shippingFee: 100,
//     totalPrice: qp1 * p1.price +... +shippingFee,
//     customerId: currentUser.id
//  }