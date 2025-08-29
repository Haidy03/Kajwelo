//import { Storage } from "../utils/localStorageHelper.js";
import { Auth } from "../utils/auth.js";
//import { Seller } from "../models/Seller.js";

Auth.apply_Autherization("seller");
const currentUser = Auth.getCurrentUser();
document.getElementById("logoutBtn").addEventListener("click", () => {
    Auth.logout();
})

document.querySelector(".user-avatar").textContent = currentUser.name.split(" ").length > 1 ? currentUser.name.split(" ")[0][0] + currentUser.name.split(" ")[1][0] : currentUser.name.split(" ")[0][0];

document.querySelector(".user-profile>span").textContent = currentUser.name;