// 🔐 utils/logout.js
import { Storage } from "./localStorageHelper.js";
import { navbar } from '../components/navbar.js';
import { footer } from '../components/footer.js';
import { Auth } from "./auth.js"
import { Customer } from "../models/Customer.js";
import { Seller } from "../models/Seller.js";
import { Admin } from "../models/Admin.js";

const currentUser = Auth.getCurrentUser();
if (currentUser instanceof Seller || currentUser instanceof Admin)
  window.location.href = "accessDeniedPage.html";

// window.addEventListener("load", () => {

// })

document.body.insertAdjacentHTML("afterbegin", navbar)
document.body.insertAdjacentHTML("beforeend", footer)

document.addEventListener("DOMContentLoaded", () => {
  // const currentUser = Auth.getCurrentUser();
  // if (!(currentUser instanceof Customer)) {
  //   window.location.href = "accessDeniedPage.html";
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
      window.location.href = "login.html";
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
      Auth.logout()

      // const modal = new bootstrap.Modal(document.getElementById("logoutModal"));
      // modal.show();
      // window.location.href = "login-register.html";

    });
  }
});
