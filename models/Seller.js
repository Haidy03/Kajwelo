import { User } from "./User.js";
import { Storage } from "../utils/localStorageHelper.js";
import { Product } from "./Product.js";

export class Seller extends User {
  constructor(name, email, password, options = {}) {
    super(name, email, password, options.phone);

    // Seller-specific fields
    this.brandName = options.brandName || '';
    this.businessAddress = options.businessAddress || null;
    this.products = options.products || [];
    this.orders = options.orders || [];
    this.earnings = options.earnings || 0;
    this.isVerified = options.isVerified || false;
    this.targetAudience = options.targetAudience || "both";
    this.role = "seller"
  }

  // Seller-specific methods
  addProduct(productData) {
    if (productData && this.isVerified) {

      const exists = this.products.some(p => p.name === productData.name);
      if (exists) {
        return { success: false, message: "already waiting for admin approval" };
      }

      const product = new Product(this.id, productData);
      this.products.push(product);
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "Product Waiting For Admin Review Successfully" }



    } else {
      return { success: false, message: "Product isn't Added, You're Not Verifed Yet" }
    }
  }


  removeProduct(productId) {
    const product = this.products.find(p => p.id === productId ? p : null)
    if (product) {
      this.products = this.products.filter(p => p.id !== productId);
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "removed successfuly" };
    } else {
      return { success: false, message: "Product isn't Found" }
    }
  }


  updateProduct(productId, productUpdated) {
    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex] = productUpdated;
      this.updatedAt = new Date();
      User.updateCurrentUser(this)
      return { success: true, message: "Updated successfuly" };
    } else {
      return { success: false, message: "Product Not found" }
    }
  }


  updateTotalEarnings() {
    //{ product: product1, quantity: 2, size: "XL", color: "red" }
    let totalEarnings = 0;
    const orders = this.orders;
    orders.forEach(instance => {

      totalEarnings += (instance.product.price * instance.quantity);

    })
    this.earnings = totalEarnings;
  }

  verify() {
    this.isVerified = true;
    this.updatedAt = new Date();
  }

  showProduct(productId) {
    let result = { success: false, message: "product isn't found" }
    this.products.forEach(product => {
      if (product.id === productId) {
        result = product.show();
        User.updateInDB(this)
      }
    })
    return result;
  }

  hideProduct(productId) {
    let result = { success: false, message: "product isn't found" }
    this.products.forEach(product => {
      if (product.id === productId) {
        result = product.hide();
        User.updateInDB(this)
      }
    })
    return result;
  }

}


// getPermissions() {
//   return [
//     'manage_products',
//     'view_orders',
//     'update_inventory',
//     'view_analytics',
//     'manage_business_profile',
//     'respond_to_reviews'
//   ];
// }

// roleSpecificValidation() {
//   if (!this.businessName) {
//     throw new Error('Business name is required for sellers');
//   }
//   return true;
// }