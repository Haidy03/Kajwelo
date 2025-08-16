// 💾 utils/localStorageHelper.js

// localStorageHelper.js
import { User } from "../models/User.js";
import { Customer } from "../models/Customer.js";
import { Seller } from "../models/Seller.js";
import { Admin } from "../models/Admin.js";
import { Product } from "../models/Product.js";

// القاموس (Class Registry)
const classMap = {
    customer: Customer,
    seller: Seller,
    admin: Admin,
    product: Product
};

export const Storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key, defaultValue = null) {
        const stored = localStorage.getItem(key);
        if (!stored) return defaultValue;

        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
            return parsed.map(item => reformProducts(reviveInstance(item)));
        }

        if (typeof parsed === "object" && parsed !== null) {
            return reformProducts(reviveInstance(parsed));
        }

        return parsed;
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    // Clears all keys from localStorage
    clear: function () {
        localStorage.clear();
    },

    // Checks if a key exists in localStorage
    has: (key) => localStorage.getItem(key) !== null,
};

// دالة عامة لإعادة بناء الـ instance
export function reviveInstance(obj) {

    if (!obj || typeof obj !== "object") return obj;

    const key = (obj.role || obj.class || "").toLowerCase();
    console.log()
    const TargetClass = classMap[key];

    if (TargetClass) {
        return Object.assign(new TargetClass(), obj);
    }

    return obj; // لو مفيش كلاس مطابق، رجّع الـ object زي ما هو
}

export function reformProducts(obj) {
    Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map(item => reviveInstance(item));
        }
    });
    return obj
}


// // Storage is a helper object that simplifies localStorage operations
// export const Storage = {
//   // Stores a value under a given key after converting it to JSON
//   set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),

//   // Retrieves a value by key and parses it from JSON
//   // Returns default value if key doesn't exist or parsing fails
//   get: (key, def = null) => {
//     try {
//       const item = localStorage.getItem(key);
//       return item ? JSON.parse(item) : def;
//     } catch {
//       return def;
//     }
//   },

//   // Removes a specific key from localStorage
//   remove: (key) => localStorage.removeItem(key),

//   // Clears all keys from localStorage
//   clear: function () {
//     localStorage.clear();
//   },

//   // Checks if a key exists in localStorage
//   has: (key) => localStorage.getItem(key) !== null,
// };

/*
🧪 Example Usage:

// Example 1: Save user data
Storage.set("user", { id: 1, name: "Abdallah", role: "admin" });

// Example 2: Retrieve user data
const user = Storage.get("user", { name: "Guest" });
*/