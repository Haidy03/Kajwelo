// 🔐 utils/logout.js
import { Storage } from "./localStorageHelper.js";
import {showModal} from "./modalHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = Storage.get("loggedInUser");
  // if (!currentUser) {
  //   window.location.href = "login-register.html";
  //   return;
  // }

  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("loginBtn");
  const cartCount = document.getElementById("cartCount");
  const cartBtn = document.getElementById("cartBtn")
  if (!logoutBtn) return;
  if (!loginBtn) return;
  if (!currentUser) {
    logoutBtn.style.display = "none";

    loginBtn.addEventListener("click", () => {
      window.location.href = "login-register.html";
    })

    cartCount.style.display = "none";

    cartBtn.addEventListener("click", () => {
      
      alert("you must login/register to access cart..!")
      /* const modal = new bootstrap.Modal(document.getElementById("quickLoginModal"));
      modal.show(); */
    });

  } else {
    loginBtn.style.display = "none";

    logoutBtn.addEventListener("click", () => {
      Storage.remove("loggedInUser");

      const modal = new bootstrap.Modal(document.getElementById("logoutModal"));
      modal.show();

      setTimeout(() => {
        window.location.href = "login-register.html";
      }, 1500);
    });
  }


});
