import { User } from "./User.js";
import { Storage } from "../utils/localStorageHelper.js";

export class Seller extends User {
  constructor(name, email, password, role, options = {}) {
    super(name, email, password, role);

    // Seller-specific fields
    this.brandName = options.brandName || '';
    this.businessAddress = options.businessAddress || null;
    this.penddingProducts = options.penddingProducts || [];
    this.products = options.products || [];
    this.orders = options.orders || [];
    this.earnings = options.earnings || 0;
    this.isVerified = options.isVerified || false;
    this.targetAudience = options.targetAudience || "both";
  }

  // Seller-specific methods
  addProduct(product) {
    if (product && this.isVerified) {
      this.penddingProducts.forEach(penddingProduct => {
        if (product.id === penddingProduct.id) return { success: false, message: "already waitig for admin approval" }
      });
      this.products.forEach(inventoryProduct => {
        if (product.id === inventoryProduct.id) return { success: false, message: "already in inventory update quantity" }
      });

      this.penddingProducts.push({
        ...product,
        sellerId: this.id,
        addedAt: new Date()
      });
      this.updatedAt = new Date();
      return { success: true, message: "Product Waiting For Admin Review Successfully" }
    } else {
      return { success: false, message: "Product isn't Added, You're Not Verifed Yet" }
    }
  }


  removeProductFromInventory(productId) {
    const product = this.products.find(p => p.id === productId ? p : null)
    if (product) {
      this.products = this.products.filter(p => p.id !== productId);
      this.updatedAt = new Date();
      return { success: true, message: "removed successfuly" };
    } else {
      return { success: false, message: "Product isn't Found" }
    }
  }

  removeProductFromPenddingList(productId) {
    const product = this.penddingProducts.find(p => p.id === productId ? p : null)
    if (product) {
      this.penddingProducts = this.penddingProducts.filter(p => p.id !== productId);
      this.updatedAt = new Date();
      return { success: true, message: "removed successfuly" };
    } else {
      return { success: false, message: "Product isn't Found" }
    }
  }

  updateProduct(productId, productUpdated) {
    let productIndex = this.penddingProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      this.penddingProducts[productIndex] = {
        ...productUpdated,
        updatedAt: new Date()
      };
      this.updatedAt = new Date();
      return { success: true, message: "Updated successfuly" };

    } else if (productIndex === -1) {
      productIndex = this.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        this.products[productIndex] = {
          ...productUpdated,
          updatedAt: new Date()
        };
        this.updatedAt = new Date();
        return { success: true, message: "Updated successfuly" };
      }
    }
    else {
      return { success: false, message: "Couldn't Found product withen This Seller products" }
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