// 🔐 models/userModel.js
export function createUser(userData, confirmCode) {
  return {
    id: crypto.randomUUID(),
    ...userData, // keeps firstName, lastName, username, email, gender, role, etc.
    confirmCode,
    isConfirmed: false,
    isMaster: false,
    createdAt: new Date().toISOString(),
    cart: [],
    wishlist:[],
    orders:[],
  };
}
