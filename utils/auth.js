// 🔐 utils/auth.js
import { Storage } from "./localStorageHelper.js";
import { createUser } from "../models/userModel.js";

const USERS_KEY = "users";

// Add Auth object if not already present
export const Auth = {
  // Login function: expects { email, password }
  login({ email, password }) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(u => u.email === email);

    if (!foundUser) {
      return { success: false, reason: "email_not_found" };
    }

    let decodedPassword;
    try {
      // Try decoding if it's Base64
      decodedPassword = atob(foundUser.password);
    } catch (e) {
      // If decoding fails, assume it's already plain text
      decodedPassword = foundUser.password;
    }

    if (decodedPassword !== password) {
      return { success: false, reason: "wrong_password" };
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    return { success: true };
  },

  register: function (formData) {
    const users = Storage.get(USERS_KEY, []);

    // Check if email exists
    if (users.find((u) => u.email === formData.email)) {
      return { success: false, message: "Email already registered." };
    }

    // Check if username exists
    if (users.find((u) => u.username === formData.username)) {
      return { success: false, message: "Username already taken." };
    }

    // Hash the password but keep the same field name
    const hashedPassword = btoa(formData.password);
    const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a full user object
    const newUser = createUser(
      {
        ...formData,
        password: hashedPassword // keep same key name
      },
      confirmCode
    );

    // Save to storage
    users.push(newUser);
    Storage.set(USERS_KEY, users);

    // Store email temporarily for confirm page
    Storage.set("pendingConfirmUser", newUser.email);

    return { success: true, code: confirmCode };
  }
  ,

  confirmEmail: function (email, code) {
    const users = Storage.get(USERS_KEY, []);
    const index = users.findIndex((u) => u.email === email);
    if (index !== -1 && users[index].confirmCode === code) {
      users[index].isConfirmed = true;
      Storage.set(USERS_KEY, users);
      Storage.remove("pendingConfirmUser");
      return { success: true };
    }
    return { success: false };
  },

  // Optional: logout function
  logout: function () {
    localStorage.removeItem("currentUser");
  },

  // Optional: get current user
  getCurrentUser: function () {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  },
};
