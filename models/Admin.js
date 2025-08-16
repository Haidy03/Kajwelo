import { Storage } from "../utils/localStorageHelper.js";
import { User } from "./User.js";
import { Customer } from "./Customer.js";
import { Seller } from "./Seller.js";
export class Admin extends User {
  constructor(name, email, password, options = {}) {
    super(name, email, password);
    // Admin-specific fields
    this.role = "Admin"
    this.adminLevel = options.adminLevel || 1; // 1: basic, 2: advanced, 3: super
  }
  // Admin-specific methods
  
  verifyBrand(brandId) {
    const users = Storage.get("users");
    const foundBrand = users.find(user => user.id === brandId);
    if (foundBrand && foundBrand instanceof Seller) {
      if (!foundBrand.isVerified) {
        foundBrand.verify();
        User.updateInDB(foundBrand);
        return { success: true, message: "Brand Verifed Successfuly" }
      } else {
        return { success: false, message: "Brand Already Verifed" }
      }
    } else {
      return { success: false, message: "Couldn't Find The Brand" }
    }
  }

  verifyProduct(brandId, productId) {
    const users = Storage.get("users");
    const foundBrand = users.find(user => user.id === brandId);
    let result = { success: false, message: "product isn't found" };
    if (foundBrand && foundBrand instanceof Seller) {
      if (foundBrand.isVerified) {
        foundBrand.products.forEach(product => {
          if (product.id === productId && !product.isVerified) {
            product.verify();
            User.updateInDB(foundBrand);
            result = { success: true, message: "Product Verifed Successfuly" }
          } else if (product.isVerified) {
            result = { success: false, message: "Product Already Verified" }
          }
        })
      } else {
        result = { success: false, message: "Brand isn't Verifed" }
      }
    } else {
      result = { success: false, message: "Couldn't Find The Brand" }
    }
    return result
  }






}


//this.department = options.department || 'general';
//this.lastLogin = options.lastLogin || null;
//this.actionHistory = options.actionHistory || [];
//this.managedUsers = options.managedUsers || [];
//this.permissions = options.permissions || this.getDefaultPermissions();



// logAction(action, target = null, details = null) {
//   this.actionHistory.push({
//     action,
//     target,
//     details,
//     timestamp: new Date(),
//     adminId: this.id
//   });
//   this.updatedAt = new Date();
// }

// manageUser(userId, action, data = null) {
//   this.logAction(`user_${action}`, userId, data);
//   if (!this.managedUsers.includes(userId)) {
//     this.managedUsers.push(userId);
//   }
//   return this;
// }

// updatePermissions(newPermissions) {
//   this.permissions = newPermissions;
//   this.logAction('permissions_updated', this.id, newPermissions);
//   this.updatedAt = new Date();
// }

// recordLogin() {
//   this.lastLogin = new Date();
//   this.logAction('login');
// }

// getDefaultPermissions() {
//   const basePermissions = [
//     'view_dashboard',
//     'view_users',
//     'view_reports',
//     'manage_content'
//   ];

//   const levelPermissions = {
//     1: [], // basic admin
//     2: ['manage_users', 'manage_sellers', 'view_analytics'], // advanced admin
//     3: ['manage_admins', 'system_config', 'full_access'] // super admin
//   };

//   return [...basePermissions, ...(levelPermissions[this.adminLevel] || [])];
// }

// getPermissions() {
//   return this.permissions;
// }

// hasPermission(permission) {
//   return this.permissions.includes(permission) || this.permissions.includes('full_access');
// }

// roleSpecificValidation() {
//   if (this.adminLevel < 1 || this.adminLevel > 3) {
//     throw new Error('Admin level must be between 1 and 3');
//   }
//   return true;
// }