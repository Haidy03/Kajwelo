// 🔐 utils/logout.js
import { Storage } from "./localStorageHelper.js";
import { navbar } from '../components/navbar.js';
import { footer } from '../components/footer.js';
import { Auth } from "./auth.js"
import { Customer } from "../models/Customer.js";
import { Seller } from "../models/Seller.js";
import { Admin } from "../models/Admin.js";



let currentUser = Auth.getCurrentUser();
// if (currentUser instanceof Seller || currentUser instanceof Admin)
//   window.location.href = "/accessDeniedPage.html";


document.body.insertAdjacentHTML("afterbegin", navbar)
document.body.insertAdjacentHTML("beforeend", footer)

document.addEventListener("DOMContentLoaded", () => {


  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("loginBtn");
  const cartCount = document.getElementById("cartCount");
  const wishlistCount = document.getElementById("wishlistCount");
  const cartBtn = document.getElementById("cartBtn")
  if (!logoutBtn) return;
  if (!loginBtn) return;

  if (!currentUser) {
    logoutBtn.style.display = "none";
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login.html";
    })
    cartCount.style.display = "none";
    wishlistCount.style.display = "none";
    cartBtn.addEventListener("click", () => {
      
      //alert("you must login/register to access cart..!")
    });
  } else {
    loginBtn.style.display = "none";
    logoutBtn.addEventListener("click", () => {
      Auth.logout()
    });
    if (currentUser.cart.length == 0) {
      cartCount.style.display = "none";
    } else {
      setInterval(() => {
        currentUser = Auth.getCurrentUser();
        if (currentUser.cart.length !== 0) {
          cartCount.textContent = currentUser.cart.length;
        }else{
          cartCount.style.display = "none";
        }

      }, 100)
    }
    if (currentUser.wishlist.length == 0) {
      wishlistCount.style.display = "none";
    } else {
      setInterval(() => {
        currentUser = Auth.getCurrentUser();
        if (currentUser.wishlist.length !== 0) {
          wishlistCount.textContent = currentUser.wishlist.length;
        }else{
          wishlistCount.style.display = "none";
        }

      }, 100)
    }
  }
});
