import { User } from "./User.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Seller } from "./Seller.js";

export class Customer extends User {
  constructor(name, email, password, role, options = {}) {
    super(name, email, password, role);

    // Customer-specific fields
    this.address = options.address || null;
    this.phone = options.phone || null;
    this.orderHistory = options.orderHistory || [];
    this.wishlist = options.wishlist || [];
    this.cart = options.cart || [];
    this.gender = options.gender || null;
    this.paymetMethod = options.paymentMethod || null;
  }

  // Customer-specific methods
  updateAdrress(newAdress) {
    this.address = newAdress;
    return { success: true, message: "Adress Updated Successfuly..!" };
  }

  updatePhone(newPhone) {
    this.phone = newPhone;
    return { success: true, message: "Phone Number Updated Successfuly..!" };
  }

  addToWishlist(item) {
    if (!this.wishlist.includes(item)) {
      this.wishlist.push(item);
      this.updatedAt = new Date();
      return { success: true, message: "Added to Wishlist" }
    } else {
      return { success: false, message: "Already in Wishlist" }
    }
  }

  addToCart(item) {
    if (!this.cart.includes(item)) {
      this.cart.push(item);
      this.updatedAt = new Date();
      return { success: true, message: "Added to Cart" }
    } else {
      return { success: false, message: "Already in Cart" }
    }
  }

  removeFromWishlist(item) {
    if (this.wishlist.includes(item)) {
      this.wishlist = this.wishlist.filter(i => i !== item);
      this.updatedAt = new Date();
      return { success: true, message: "Removed from Wishlist" }
    } else {
      return { success: false, message: "Not Found in Wishlist" }
    }
  }

  removeFromCart(item) {
    if (this.cart.includes(item)) {
      this.cart = this.cart.filter(i => i !== item);
      this.updatedAt = new Date();
      return { success: true, message: "Removed from Cart" }
    } else {
      return { success: false, message: "Not Found in Cart" }
    }
  }

  checkout(order) {
    let result = { success: false, message: "Order Isn't Valid No Elements" };
    if (order && order.length !== 0) {
      this.orderHistory.push({
        ...order,
        orderedAt: new Date()
      });
      this.updatedAt = new Date();

      this.cart = []
      //{ product: product1, quantity: 2, size: "XL", color: "red" }
      const users = Storage.get("users");

      order.forEach(instance => {
        users.forEach(user => {
          if (user instanceof Seller && user.id === instance.product.sellerId) {
            const inventory = user.products;
            inventory.forEach(product => {

              if (product.id === instance.product.id) {

                if (!product.availableSizes.includes(instance.size)) result = { success: false, message: "Size isn't availabe in inventory" };
                if (!product.availableColors.includes(instance.color)) result = { success: false, message: "Color isn't availabe in inventory" };
                let stock = product.stock;

                stock.forEach(variation => {
                  if (variation.color == instance.color && variation.size == instance.size) {

                    if (variation.quantity < instance.quantity) result = { success: false, message: "Out Of Stock" };
                    else if (variation.quantity >= instance.quantity) {
                      variation.quantity -= instance.quantity;
                      if (variation.quantity == 0) product.stock = stock.filter(v => v.quantity !== 0)
                      if (product.stock.length == 0) product.visibility = false;
                      user.orders.push(instance)
                      user.updateTotalEarnings();
                      User.updateInDB(user);
                      result = { success: true, message: "Order CheckedOut..!" }
                    }
                  }
                })
              }
            })
          }
        })
      })
      return result
    }
    return result
  }



}







// getPermissions() {
//   return [
//     'view_products',
//     'place_orders',
//     'manage_wishlist',
//     'view_order_history',
//     'update_profile'
//   ];
// }

// roleSpecificValidation() {
//   // Add customer-specific validation here
//   return true;
// }