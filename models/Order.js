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
        const sellerIds = [];
        const users = Storage.get("users", []);
        const sellers = users.filter(user => user instanceof Seller);
        const result = retrive.allValidProducts();
        const allValidProducts = result.products;
        if (allValidProducts.length !== 0) {
            this.products.forEach(orderedProduct => {
                let fullProduct = allValidProducts.find(product => product.id === orderedProduct.productId)
                users.forEach(user => {
                    if (user.id === fullProduct.sellerId) {
                        const thisSellerOrder = new Order(this.customerId);
                        thisSellerOrder.orderId = this.orderId;
                        user.earnings += fullProduct.price * orderedProduct.quantity
                        user.products.forEach(product => {
                            if (product.id == fullProduct.id) {
                                thisSellerOrder.addProduct(orderedProduct.productId, orderedProduct.size, orderedProduct.color, orderedProduct.quantity);
                                product.stock.forEach(variant => {
                                    if (variant["size"] === orderedProduct.size && variant["color"] === orderedProduct.color) {
                                        variant["quantity"] -= orderedProduct.quantity;
                                        if (variant["quantity"] === 0) {
                                            product.stock = product.stock.filter(v => v["color"] !== variant["color"] && v["size"] !== variant["size"])
                                            product.availableColors = product.availableColors.filter(c => c !== variant["color"])
                                            product.availableSizes = product.availableSizes.filter(s => s !== variant["size"])
                                        }
                                    }
                                })
                            }
                        })
                        user.orders.push(thisSellerOrder);
                        User.updateInDB(user)
                    }
                })
            });
        }

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