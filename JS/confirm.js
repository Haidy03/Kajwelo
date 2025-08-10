// 📨 scripts/confirm.js
import { Auth } from "../utils/auth.js";
import { Storage } from "../utils/localStorageHelper.js";
import { showModal } from "../utils/modalHelper.js"; // ✅ أضف الاستيراد هنا

const form = document.getElementById("confirmForm");
const codeInput = form.code;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  form.classList.add("was-validated");

  const code = codeInput.value.trim();
  const email = Storage.get("pendingConfirmUser");

  if (!email) {
    showModal("No pending confirmation found", "warning", "Wait a minute!");
    return;
  }

  if (!form.checkValidity()) return;

  const result = Auth.confirmEmail(email, code);

  if (result.success) {
    showModal("Email confirmed successfully!", "success", "Done");
    let users=Storage.get("users", []);
    let password;
    users.forEach(user => {
      if (user.email === email) {
         password = atob(user.password);
      }
    });
    Auth.login({ email, password });

    setTimeout(() => {
      window.location.href = "testnav.html";
    }, 1500); // وقت كافي لقراءة الرسالة
  } else {
    codeInput.classList.remove("is-valid");
    codeInput.classList.add("is-invalid");
    codeInput.nextElementSibling.textContent = "Wrong confirmation code.";
  }
});
