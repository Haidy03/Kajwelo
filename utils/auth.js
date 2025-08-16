// 🔐 utils/auth.js
import { Storage } from "./localStorageHelper.js";
import { User } from "../models/User.js";
import { Customer } from "../models/Customer.js";
import { Seller } from "../models/Seller.js";
import { Admin } from "../models/Admin.js";

const USERS_KEY = "users";



// Add Auth object if not already present
export class Auth {
  // Login function: expects { email, password }
  static login(email, password) {
    const users = Storage.get("users");
    const foundUser = users.find(u => u.email === email);


    if (!foundUser) {
      return { success: false, message: "email_not_found" };
    }

    let decodedPassword;
    try {
      // Try decoding if it's Base64
      decodedPassword = decodeUnicode(foundUser.password);
    } catch (e) {
      // If decoding fails, assume it's already plain text
      decodedPassword = foundUser.password;
    }

    if (decodedPassword !== password) {
      return { success: false, message: "wrong_password" };
    }

    Storage.set("loggedInUser", foundUser);
    console.log(Storage.get("loggedInUser"))

    //console.log(foundUser)
    return { success: true, message: "LoggedIn Successfuly" };
  }

  static register(formData) {
    const users = Storage.get(USERS_KEY, []);
    const pendingConfirmUser = Storage.get("pendingConfirmUser", []);
    // Check if email exists
    if (users.find((u) => u.email === formData.email)) {
      return { success: false, message: "Email already registered." };
    }

    const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (formData.role.toLowerCase() === "customer") {
      const newCustomer = new Customer(formData.name, formData.email, encodeUnicode(formData.password),
        { gender: formData.gender || null, address: formData.address || null, phone: formData.phone || null });
      newCustomer.confirmCode = confirmCode;
      users.push(newCustomer);
      pendingConfirmUser.push(newCustomer.email)
      Storage.set("pendingConfirmUser", pendingConfirmUser);

    } else if (formData.role.toLowerCase() === "seller") {
      if (users.find((u) => u.brandName === formData.brandName)) {
        return { success: false, message: "Brand already registered." };
      }
      const newSeller = new Seller(formData.name, formData.email, encodeUnicode(formData.password),
        {
          brandName: formData.brandName || null, businessAddress: formData.address || null
          , targetAudience: formData.targetAudience || null, phone: formData.phone
        });

      newSeller.confirmCode = confirmCode;
      users.push(newSeller);
      pendingConfirmUser.push(newSeller.email)
      Storage.set("pendingConfirmUser", pendingConfirmUser);
    } else if (formData.role.toLowerCase() === "admin") {
      const newAdmin = new Admin(formData.name, formData.email, encodeUnicode(formData.password),
        {adminLevel:formData.adminLevel});
      newAdmin.isConfirmed = true;
      users.push(newAdmin);
    } else {
      return { success: false, message: "Invalid Role" }
    }

    Storage.set(USERS_KEY, users);
    return { success: true, message: "registered Successfuly", code: confirmCode };
  }


  static confirmEmail(email, code) {
    const users = Storage.get(USERS_KEY, []);
    let pendingConfirmUser = Storage.get("pendingConfirmUser", []);
    const index = users.findIndex((u) => u.email === email);
    if (index !== -1 && users[index].confirmCode === code) {
      users[index].isConfirmed = true;
      Storage.set(USERS_KEY, users);
      pendingConfirmUser = pendingConfirmUser.filter(u => u !== email)
      Storage.set("pendingConfirmUser", pendingConfirmUser);
      return { success: true, message: "Confirmed" };
    }
    return { success: false, message: "Not Confirmed" };
  }

  // Optional: logout function
  static logout() {
    Storage.remove("loggedInUser");
  }

  // Optional: get current user
  static getCurrentUser() {
    return Storage.get("loggedInUser");
  }
};

function encodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function decodeUnicode(base64) {
  return decodeURIComponent(escape(atob(base64)));
}