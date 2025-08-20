import { User } from "./User.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Seller } from "./Seller.js";
import { Order } from "../models/Order.js"


export class Customer extends User {
  constructor(name, email, password, options = {}) {
    super(name, email, password, options.phone);

    // Customer-specific fields
    this.address = options.address || null;
    this.orderHistory = options.orderHistory || [];
    this.wishlist = options.wishlist || [];
    this.cart = options.cart || [];
    this.gender = options.gender || null;
    this.paymetMethod = options.paymentMethod || null;
    this.role = "customer";
  }

  // Customer-specific methods
  updateAdrress(newAdress) {
    this.address = newAdress;
    User.updateCurrentUser(this)
    return { success: true, message: "Adress Updated Successfuly..!" };
  }

  updatePhone(newPhone) {
    this.phone = newPhone;
    User.updateCurrentUser(this)
    return { success: true, message: "Phone Number Updated Successfuly..!" };
  }

  addToWishlist(item) {
    if (!this.wishlist.includes(item)) {
      this.wishlist.push(item);
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "Added to Wishlist" }
    } else {
      return { success: false, message: "Already in Wishlist" }
    }
  }

  addToCart(item) {
    if (!this.cart.includes(item)) {
      this.cart.push(item);
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "Added to Cart" }
    } else {
      return { success: false, message: "Already in Cart" }
    }
  }

  removeFromWishlist(item) {
    if (this.wishlist.includes(item)) {
      this.wishlist = this.wishlist.filter(i => i !== item);
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "Removed from Wishlist" }
    } else {
      return { success: false, message: "Not Found in Wishlist" }
    }
  }

  removeFromCart(item) {
    if (this.cart.includes(item)) {
      this.cart = this.cart.filter(i => i !== item);
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "Removed from Cart" }
    } else {
      return { success: false, message: "Not Found in Cart" }
    }
  }

  checkout(order) {
    if (order.products.length !== 0) {
      order.updateSellersEarning();
      order.status="Checked Out - Waiting to be Shipped"
      this.orderHistory.push(order)
      this.cart=[];
      User.updateCurrentUser(this)
    }
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