// utils/validator.js

export const Validator = {
  // First and last name: only letters, at least 2 chars (to match signup-form and userModel.js)
  isNameValid: (name) => {
    if (!name) return false;
    const cleaned = name.trim();
    // Only letters, at least 2 chars
    return /^[A-Za-z]{2,}$/.test(cleaned);
  },

  // Username: at least 4 chars, letters, numbers, or _
  isUsernameValid: (username) => /^[A-Za-z0-9_]{4,}$/.test(username),

  // Email: standard email validation
  isEmailValid: (email) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email),

  // Password: at least 6 chars, at least one uppercase, one lowercase, and one digit
  isPasswordValid: (pass) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(pass),
};
