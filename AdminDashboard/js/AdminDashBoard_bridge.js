// AdminDashBoard_bridge.js (module)
// Purpose: Provide safe, reusable operations for the AdminDashboard to persist changes to localStorage
// without modifying files outside AdminDashboard. Exposes functions via window.AdminOps.

import { Storage } from "../../utils/localStorageHelper.js";
import { Auth } from "../../utils/auth.js";
import { Admin } from "../../models/Admin.js";
import { Seller } from "../../models/Seller.js";
import { Customer } from "../../models/Customer.js";
import { User } from "../../models/User.js";
import { Product } from "../../models/Product.js";

function getUsers() {
  return Storage.get("users", []);
}
function setUsers(users) {
  Storage.set("users", users);
}
function getCurrentUser() {
  return Storage.get("loggedInUser");
}

function level() {
  return Number(window.adminAccess?.level) || 1; // 1: product, 2: super, 3: master
}
function isMaster() { return level() === 3; }
function isSuper() { return level() === 2; }
function isProduct() { return level() === 1; }

function findSellerById(users, sellerId) {
  return users.find(u => (u instanceof Seller) && u.id === sellerId);
}

function findProductOwner(users, productId) {
  for (const u of users) {
    if (u instanceof Seller && Array.isArray(u.products)) {
      const idx = u.products.findIndex(p => p.id === productId);
      if (idx !== -1) return { seller: u, index: idx };
    }
  }
  return null;
}

function verifySeller(sellerId) {
  const admin = getCurrentUser();
  if (!(admin instanceof Admin)) return { success: false, message: "not_admin" };
  if (isProduct()) return { success: false, message: "forbidden" };
  try {
    const res = admin.verifyBrand(sellerId);
    if (res?.success) {
      // Stamp verifiedAt for dashboard analytics
      const users = getUsers();
      const s = users.find(u => (u instanceof Seller) && String(u.id) === String(sellerId));
      if (s) { s.verifiedAt = new Date().toISOString(); setUsers(users); }
    }
    return res;
  } catch (e) {
    return { success: false, message: e?.message || "verify_brand_failed" };
  }
}

function verifyProduct(sellerId, productId) {
  const admin = getCurrentUser();
  if (!(admin instanceof Admin)) return { success: false, message: "not_admin" };
  try {
    const res = admin.verifyProduct(sellerId, productId);
    if (res?.success) {
      // Stamp verifiedAt for product
      const users = getUsers();
      const owner = users.find(u => (u instanceof Seller) && String(u.id) === String(sellerId));
      if (owner && Array.isArray(owner.products)) {
        const p = owner.products.find(pp => String(pp.id) === String(productId));
        if (p) { p.verifiedAt = new Date().toISOString(); setUsers(users); }
      }
    }
    return res;
  } catch (e) {
    return { success: false, message: e?.message || "verify_product_failed" };
  }
}

function deleteProductById(productId) {
  // Allow product admins to delete products (needed for deleting unverified products from verification requests)
  const users = getUsers();
  const owner = findProductOwner(users, productId);
  if (!owner) return { success: false, message: "product_not_found" };
  owner.seller.products.splice(owner.index, 1);
  setUsers(users);
  return { success: true };
}

function deleteCategoryProducts(categoryName) {
  if (isProduct()) return { success: false, message: "forbidden" };
  const users = getUsers();
  let removed = 0;
  users.forEach(u => {
    if (u instanceof Seller && Array.isArray(u.products)) {
      const before = u.products.length;
      u.products = u.products.filter(p => (p.category || "") !== categoryName);
      removed += (before - u.products.length);
    }
  });
  setUsers(users);
  return { success: true, removed };
}

function deleteUserById(userId) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return { success: false, message: "user_not_found" };
  const u = users[idx];
  if (u instanceof Admin && !isMaster()) {
    return { success: false, message: "forbidden" };
  }
  // If seller, move to suspendedUsers
  if (u instanceof Seller) {
    let suspendedUsers = Storage.get("suspendedUsers", []);
    if (!suspendedUsers.includes(u.email)) {
      suspendedUsers.push(u.email);
      Storage.set("suspendedUsers", suspendedUsers);
    }
  }
  users.splice(idx, 1);
  setUsers(users);
  return { success: true };
}

function markInboxReadById(id) {
  const admin = getCurrentUser();
  if (!admin) return { success: false, message: "no_current_user" };
  const key = `adminInbox_${admin.id}`;
  const inbox = Storage.get(key, []);
  const idx = inbox.findIndex(m => m.id === id);
  if (idx === -1) return { success: false, message: "message_not_found" };
  inbox[idx].status = "read";
  Storage.set(key, inbox);
  return { success: true };
}

function deleteInboxById(id) {
  const admin = getCurrentUser();
  if (!admin) return { success: false, message: "no_current_user" };
  const key = `adminInbox_${admin.id}`;
  let inbox = Storage.get(key, []);
  const before = inbox.length;
  inbox = inbox.filter(m => m.id !== id);
  Storage.set(key, inbox);
  return { success: true, removed: before - inbox.length };
}

function resetSellerPassword(sellerId, newPass = "123") {
  if (isProduct()) return { success: false, message: "forbidden" };
  const users = getUsers();
  const seller = findSellerById(users, sellerId);
  if (!seller) return { success: false, message: "seller_not_found" };
  // Encode password like registration
  function encodeUnicode(str) { try { return btoa(unescape(encodeURIComponent(str))); } catch { return str; } }
  seller.password = encodeUnicode(newPass);
  setUsers(users);
  return { success: true };
}

function verifyRequestById(requestId) {
  // Uses current window.dataStore built by the dashboard data layer
  const req = (window.dataStore?.verificationRequests || []).find(r => String(r.id) === String(requestId));
  if (!req) return { success: false, message: "request_not_found" };

  // Product admin can only verify products
  if (isProduct() && req.type !== "product") {
    return { success: false, message: "forbidden" };
  }

  if (req.type === "seller") {
    return verifySeller(req.entityId);
  }
  if (req.type === "product") {
    // We attempt to infer sellerId from req (data layer includes sellerId for product requests)
    const sellerId = req.sellerId || null;
    if (!sellerId) {
      // Fallback: try to find owner by product id
      const users = getUsers();
      const owner = findProductOwner(users, req.entityId);
      if (!owner) return { success: false, message: "product_owner_not_found" };
      return verifyProduct(owner.seller.id, req.entityId);
    }
    return verifyProduct(sellerId, req.entityId);
  }
  return { success: false, message: "unsupported_request_type" };
}

function toggleCustomerActive(id) {
  const users = getUsers();
  const u = users.find(x => x.id === id);
  if (!u) return { success: false, message: 'user_not_found' };
  // Only toggle for customers
  if (!(u instanceof Customer)) return { success: false, message: 'not_customer' };
  u.isConfirmed = !u.isConfirmed;
  setUsers(users);
  return { success: true, isConfirmed: u.isConfirmed };
}

function setSellerVerification(sellerId, isVerified) {
  const users = getUsers();
  const s = users.find(u => (u instanceof Seller) && String(u.id) === String(sellerId));
  if (!s) return { success: false, message: 'seller_not_found' };
  s.isVerified = !!isVerified;
  s.verifiedAt = s.isVerified ? new Date().toISOString() : null;
  setUsers(users);
  return { success: true, isVerified: s.isVerified };
}

function setProductVerification(sellerId, productId, isVerified) {
  const users = getUsers();
  const owner = users.find(u => (u instanceof Seller) && String(u.id) === String(sellerId));
  if (!owner) return { success: false, message: 'seller_not_found' };
  if (!Array.isArray(owner.products)) return { success: false, message: 'no_products' };
  const p = owner.products.find(pp => String(pp.id) === String(productId));
  if (!p) return { success: false, message: 'product_not_found' };
  p.isVerified = !!isVerified;
  p.verifiedAt = p.isVerified ? new Date().toISOString() : null;
  setUsers(users);
  return { success: true, isVerified: p.isVerified };
}

function bulkDelete(section, ids) {
  let total = 0;
  for (const id of ids) {
    let res;
    switch (section) {
      case "products":
        res = deleteProductById(id);
        break;
      case "categories":
        // For categories we expect the caller to pass names rather than ids. The dashboard passes ids; skip here.
        res = { success: false };
        break;
      case "sellers":
      case "customers":
      case "admins":
        res = deleteUserById(id);
        break;
      case "inbox":
        res = deleteInboxById(id);
        break;
      default:
        res = { success: false };
    }
    if (res?.success) total++;
  }
  return { success: true, count: total };
}

function refreshData() {
  if (typeof window.refreshAdminData === "function") {
    window.refreshAdminData();
  }
}

// Categories registry helpers
const CATEGORIES_KEY = 'categoryRegistry';
function getCategoryRegistry() {
  try { return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]'); } catch { return []; }
}
function setCategoryRegistry(arr) { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(arr)); }

// Add operations
function addProduct(data) {
  const { sellerId, name, description, price, category, subcategory, availableColors, availableSizes, stockQuantity, status } = data;
  const users = getUsers();
  const seller = users.find(u => (u instanceof Seller) && String(u.id) === String(sellerId));
  if (!seller) return { success: false, message: 'seller_not_found' };
  const colors = Array.isArray(availableColors) ? availableColors : (String(availableColors||'').split(',').map(s=>s.trim()).filter(Boolean));
  const sizes = Array.isArray(availableSizes) ? availableSizes : (String(availableSizes||'').split(',').map(s=>s.trim()).filter(Boolean));
  const qty = Number(stockQuantity)||0;
  const stock = qty>0 ? [{ size: (sizes[0]||'M'), color: (colors[0]||'black'), quantity: qty }] : [];
  const p = new Product(seller.id, { name, description, price: Number(price)||0, category, subcategory, availableColors: colors, availableSizes: sizes, stock });
  // Admin add: allow regardless of seller.isVerified; verification remains false until verified
  seller.products = seller.products || [];
  seller.products.push(p);
  setUsers(users);
  return { success: true, id: p.id };
}

function addCustomer(data) {
  const { name, email, password, phone, address, status } = data;
  const res = Auth.register({ name, email, password, role: 'customer', address, phone });
  if (!res?.success) return res;
  const users = getUsers();
  const u = users.find(x => x.email === email);
  if (u) { u.isConfirmed = (status !== 'inactive'); setUsers(users); }
  return { success: true, id: u?.id };
}

function addSeller(data) {
  if (isProduct()) return { success: false, message: 'forbidden' };
  const { name, email, password, phone, address, brandName, status } = data;
  const res = Auth.register({ name, email, password, role: 'seller', phone, address, brandName });
  if (!res?.success) return res;
  const users = getUsers();
  const u = users.find(x => x.email === email);
  if (u) { u.isVerified = (status !== 'inactive'); setUsers(users); }
  return { success: true, id: u?.id };
}

function addAdmin(data) {
  if (!isMaster()) return { success: false, message: 'forbidden' };
  const { name, email, password, role } = data;
  // Map role from UI to adminLevel
  let adminLevel = 1; // product
  switch ((role||'').toLowerCase()) {
    case 'master': adminLevel = 3; break; // master
    case 'super': adminLevel = 2; break;   // super
    default: adminLevel = 1; // product
  }
  const res = Auth.register({ name, email, password, role: 'admin', adminLevel });
  if (!res?.success) return res;
  const users = getUsers();
  const u = users.find(x => x.email === email);
  if (u) { u.isConfirmed = true; setUsers(users); }
  return { success: true, id: u?.id };
}

function addCategory(data) {
  const { name, description, status } = data;
  const reg = getCategoryRegistry();
  if (reg.find(c => c.name.toLowerCase() === String(name||'').toLowerCase())) {
    return { success: false, message: 'category_exists' };
  }
  reg.push({ name, description: description||'', status: status||'active' });
  setCategoryRegistry(reg);
  return { success: true };
}

window.AdminOps = {
  getUsers,
  setUsers,
  getCurrentUser,
  isMaster,
  isSuper,
  isProduct,

  verifySeller,
  verifyProduct,
  verifyRequestById,

  deleteProductById,
  deleteCategoryProducts,
  deleteUserById,

  markInboxReadById,
  deleteInboxById,

  resetSellerPassword,
  bulkDelete,
  toggleCustomerActive,

  addProduct,
  addCustomer,
  addSeller,
  addAdmin,
  addCategory,

  setSellerVerification,
  setProductVerification,

  refreshData,
};

// Expose AdminOps to the window object
window.AdminOps = AdminOps;

// End of bridge module

export default AdminOps;
