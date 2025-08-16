// const testProduct = {
//     id: crypto.randomUUID(),
//     sellerId: townteam.id,
//     name: "Skirt",               // e.g. "Oversized Graphic Tee"
//     description: "A Cute Skirt",        // Full product description
//     price: 350,              // Base price (may vary with size or color)
//     image: "/images/anyImage.jpg",             // URLs to product images
//     category: "Women",           // "Men", "Women", "Unisex", etc.
//     subcategory: "Skirt",        // "T-Shirts", "Jeans", "Hoodies", etc.
//     // Reference to seller (brand)
//     availableColors: ["Red", "Black", "Blue"],  // Hex or color names e.g. ["#000000", "Red"]
//     availableSizes: ["XL", "M"],   // ["S", "M", "L", "XL"]
//     stock: [{ size: "XL", color: "Red", quantity: 5 }],// Stock per size and color
//     tags: ["Best Seller"],             // ["summer", "casual", "sale"]
//     visibility: true,
//     salePrice: 175,          // If applicable
//     createdAt: Date,
//     updatedAt: Date
// }

export class Product {
    constructor(sellerId, productData = {}) {
        this.id = crypto.randomUUID();
        this.sellerId = sellerId;
        this.name = productData.name || null;
        this.description = productData.description || null;
        this.price = productData.price || null;
        this.image = productData.image || null;
        this.category = productData.category || null;
        this.subcategory = productData.subcategory || null;
        this.availableColors = productData.availableColors || [];
        this.availableSizes = productData.availableSizes || [];
        this.stock = productData.stock || [];
        this.tags = productData.tags || [];
        this.isVerified = false;
        this.visibility = false;
        this.salePrice = productData.salePrice || null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.class = "product";
    }

    updateProduct(updates) {
        Object.keys(updates).forEach(key => {
            if (key !== 'id' && key !== 'sellerId' && key !== 'createdAt' && key !== 'visibility') {
                this[key] = updates[key];
            } else {
                return { success: false, message: "Not Allowed To Update ProductId Or SellerId Or Creation Time" }
            }
        });
        this.updatedAt = new Date();
        return { success: true, message: "Updated Successfuly" };
    }

    addStock(size, color, quantity) {
        const existingStock = this.stock.find(s => s.size === size && s.color === color);
        if (existingStock) {
            existingStock.quantity += quantity;
        } else {
            this.stock.push({ size, color, quantity });
        }
        this.updatedAt = new Date();
        return { success: true, message: "Stock Updated Successfuly" }
    }

    isOnSale() {
        return this.salePrice !== null && this.salePrice < this.price;
    }

    getEffectivePrice() {
        return this.isOnSale() ? this.salePrice : this.price;
    }

    getTotalStock() {
        return this.stock.reduce((total, item) => total + item.quantity, 0);
    }

    getStock(size, color) {
        const stockItem = this.stock.find(s => s.size === size && s.color === color);
        return stockItem ? stockItem.quantity : 0;
    }

    isValid() {
        return !!(this.name && this.description && this.price &&
            this.category && this.subcategory && this.sellerId);
    }

    verify() {
        this.isVerified = true;
        this.updatedAt = new Date();
    }

    // Method to show the product (set visibility to true)
    show() {
        if (this.isVerified) {
            this.visibility = true;
            this.updatedAt = new Date();
            return {success : true , message: "Product is Now Visiable"}
        }else{
            return {success : false , message: "Product isn't Approved By Admin Yet"}
        }
    }

    // Method to hide the product (set visibility to false)
    hide() {
        this.visibility = false;
        this.updatedAt = new Date();
        return {success:true , message:"Product is Hidden From Customers"}
    }
}

const validColors = [
    "black", "white", "gray", "silver", "red", "maroon", "crimson", "salmon", "orange",
    "coral", "yellow", "gold", "green", "lime", "blue", "navy", "skyblue", "azure",
    "royalblue", "teal", "turquoise", "aqua", "purple", "violet", "lavender", "indigo",
    "plum", "magenta", "fuchsia", "pink", "hotpink", "brown", "chocolate", "tan", "beige"];

const allowedSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];