// 🔐 utils/logout.js
import { Storage } from "./localStorageHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = Storage.get("loggedInUser");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    Storage.remove("loggedInUser");

    const modal = new bootstrap.Modal(document.getElementById("logoutModal"));
    modal.show();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
});
