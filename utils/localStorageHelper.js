// 💾 utils/localStorageHelper.js
export const Storage = {
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  get: (key, def = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : def;
    } catch {
      return def;
    }
  },
  remove: (key) => localStorage.removeItem(key),

  clear: function () { localStorage.clear(); },

  has: (key) => localStorage.getItem(key) !== null,
};
