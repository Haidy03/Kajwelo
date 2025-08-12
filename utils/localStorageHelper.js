// 💾 utils/localStorageHelper.js

// Storage is a helper object that simplifies localStorage operations
export const Storage = {
  // Stores a value under a given key after converting it to JSON
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),

  // Retrieves a value by key and parses it from JSON
  // Returns default value if key doesn't exist or parsing fails
  get: (key, def = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : def;
    } catch {
      return def;
    }
  },

  // Removes a specific key from localStorage
  remove: (key) => localStorage.removeItem(key),

  // Clears all keys from localStorage
  clear: function () {
    localStorage.clear();
  },

  // Checks if a key exists in localStorage
  has: (key) => localStorage.getItem(key) !== null,
};

/*
🧪 Example Usage:

// Example 1: Save user data
Storage.set("user", { id: 1, name: "Abdallah", role: "admin" });

// Example 2: Retrieve user data
const user = Storage.get("user", { name: "Guest" });
*/