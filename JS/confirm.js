// 📨 scripts/confirm.js
import { Auth } from "../utils/auth.js";
import { Storage } from "../utils/localStorageHelper.js";
import { showModal } from "../utils/modalHelper.js"; // ✅ أضف الاستيراد هنا

const form = document.getElementById("confirmForm");
const codeInput = form.code;
const email = Auth.getCurrentUser().email;
const pendingConfirmUser = Storage.get("pendingConfirmUser", []);
if (!pendingConfirmUser.includes(email)) {
  showModal("No pending confirmation found", "warning", "Wait a minute!");
  setTimeout(() => {
    window.location.href = "FinalHomePage.html";
  }, 1500);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  form.classList.add("was-validated");

  const code = codeInput.value.trim();


  if (!form.checkValidity()) return;

  const result = Auth.confirmEmail(email, code);
  console.log(result);
  if (result.success) {
    showModal("Email confirmed successfully!", "success", "Done");
    let users = Storage.get("users", []);
    let password;
    users.forEach(user => {
      if (user.email === email) {
        password = atob(user.password);
      }
    });
    Auth.login({ email, password });

    setTimeout(() => {
      window.location.href = "FinalHomePage.html";
    }, 1500); // وقت كافي لقراءة الرسالة
  } else {
    document.querySelector(".invalid-feedback").textContent = "Wrong confirmation code.";
  }
});
