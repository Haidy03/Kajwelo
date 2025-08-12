// scripts/login-manual-login.js
import { Validator } from "../utils/validator.js";
import { Auth } from "../utils/auth.js";
import { showModal } from "../utils/modalHelper.js";
import { toggleMode } from "./login-manual-ui.js";

const loginForm = document.getElementById("loginForm");
const showPasswordCheck = document.getElementById("showPasswordCheck");
const codeField = document.getElementById("confirmationCodeField");
const show_hide_loginPasswordText=document.querySelector("#showLoginPass>label")
const pwd = document.getElementById('loginPassword');

// Show/hide password
showPasswordCheck.addEventListener("click", () => {
    
    pwd.type = showPasswordCheck.innerHTML == `<i class="fa-regular fa-eye-slash"></i>` ? "text" : "password";
    showPasswordCheck.innerHTML = showPasswordCheck.innerHTML == `<i class="fa-regular fa-eye-slash"></i>` ? `<i class="fa-regular fa-eye"></i>` : `<i class="fa-regular fa-eye-slash"></i>`;
    show_hide_loginPasswordText.textContent = show_hide_loginPasswordText.textContent == "Show Password" ? "Hide Password" : "Show Password";
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginForm.classList.add("was-validated");

    const email = loginForm.loginEmail.value.trim();
    const password = loginForm.loginPassword.value;
    if (!Validator.isEmailValid(email) || !Validator.isPasswordValid(password)) {
        // Trigger Bootstrap's invalid-feedback by forcing the form into validated state
        loginForm.classList.add("was-validated");

        // Optionally, show modal too (clearer for the user)
        document.getElementById('globalModalBodyText').textContent =
            "Please enter a valid email and a password with at least 6 characters.";
        codeField.classList.add('d-none');

        const footer = document.getElementById('globalModalFooter');
        footer.innerHTML = `
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">OK</button>
    `;

        const modal = new bootstrap.Modal(document.getElementById('globalModal'));
        modal.show();

        return; // stop login process
    };

    if (!loginForm.checkValidity()) return;

    const result = Auth.login({ email, password });

    if (result && result.success) {
        window.location.href = "testnav.html";
    } else {
        let message = "We couldn't log you in. Please check your email and password.";
        if (result.reason === "email_not_found") {
            message = "We couldn't find an account with that email. Try signing up!";
        }

        document.getElementById('globalModalBodyText').textContent = message;
        codeField.classList.add('d-none');

        const footer = document.getElementById('globalModalFooter');
        footer.innerHTML = `
        <button type="button" class="btn btn-outline-secondary" id="modalSignUpBtn" data-bs-dismiss="modal">
            Sign Up
        </button>
    `;

        const modal = new bootstrap.Modal(document.getElementById('globalModal'));
        modal.show();

        document.getElementById('modalSignUpBtn').onclick = () => {
            toggleMode(true); // Desktop form toggle

            // ✅ Mobile form toggle
            const mobileSignupBtn = document.getElementById("mobileSignupBtn");
            const mobileLoginBtn = document.getElementById("mobileLoginBtn");
            const signupPanel = document.getElementById("signupPanel");
            const loginPanel = document.getElementById("loginPanel");

            if (window.innerWidth <= 600 && mobileSignupBtn && mobileLoginBtn && signupPanel && loginPanel) {
                mobileSignupBtn.classList.add("signup-active");
                mobileSignupBtn.classList.remove("inactive", "login-active");
                mobileLoginBtn.classList.add("inactive");
                mobileLoginBtn.classList.remove("login-active", "signup-active");

                signupPanel.style.display = "";
                loginPanel.style.display = "none";
            }
        };
    }
});
