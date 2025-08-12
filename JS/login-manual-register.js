// scripts/login-manual-register.js
import { Validator } from "../utils/validator.js";
import { Auth } from "../utils/auth.js";
import { toggleMode } from "./login-manual-ui.js"; // ✅ add this


const signupForm = document.getElementById("signupForm");
const showSignupPassword = document.getElementById("showSignupPassword");
const show_hide_passwordText=document.querySelector("#showRegisterPass>label");

// Show/hide signup password
showSignupPassword.addEventListener("click", () => {
    const pwd = document.getElementById('signupPassword');
    const cpwd = document.getElementById('signupConfirmPassword');
    const type = showSignupPassword.innerHTML==`<i class="fa-regular fa-eye-slash"></i>` ? "text" : "password";
    pwd.type = type;
    cpwd.type = type;
    showSignupPassword.innerHTML= showSignupPassword.innerHTML==`<i class="fa-regular fa-eye-slash"></i>`? `<i class="fa-regular fa-eye"></i>`:`<i class="fa-regular fa-eye-slash"></i>`;
    show_hide_passwordText.textContent= show_hide_passwordText.textContent=="Show Password"? "Hide Password":"Show Password"
});

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signupForm.classList.add("was-validated");
    let isFormValid = true;

    const data = {
        firstName: signupForm.signupFirstName.value.trim(),
        lastName: signupForm.signupLastName.value.trim(),
        username: signupForm.signupUsername.value.trim(),
        email: signupForm.signupEmail.value.trim(),
        password: signupForm.signupPassword.value,
        confirmPassword: signupForm.signupConfirmPassword.value,
        gender: signupForm.gender ? signupForm.gender.value : "",
        role: signupForm.joinAs ? signupForm.joinAs.value : ""
    };

    if (!Validator.isNameValid(data.firstName)) isFormValid = false;
    if (!Validator.isNameValid(data.lastName)) isFormValid = false;
    if (!Validator.isUsernameValid(data.username)) isFormValid = false;
    if (!Validator.isEmailValid(data.email)) isFormValid = false;
    if (!Validator.isPasswordValid(data.password)) isFormValid = false;
    if (!data.confirmPassword || data.password !== data.confirmPassword) {
        signupForm.signupConfirmPassword.classList.add("is-invalid");
        isFormValid = false;
    }

    if (!signupForm.checkValidity() || !isFormValid) return;

    const result = Auth.register(data);

    if (result.success && result.code) {
        document.getElementById('globalModalBodyText').textContent =
            "Registration successful! Please copy your confirmation code and check your email.";
        const codeField = document.getElementById('confirmationCodeField');
        codeField.value = result.code;
        codeField.classList.remove('d-none');

        const footer = document.getElementById('globalModalFooter');
        footer.innerHTML = `<button type="button" class="btn btn-primary" id="copyCodeBtn" data-bs-dismiss="modal">Copy Code</button>`;

        const modal = new bootstrap.Modal(document.getElementById('globalModal'));
        modal.show();

        document.getElementById('copyCodeBtn').onclick = () => {
            navigator.clipboard.writeText(result.code).then(() => {
                modal.hide();
                setTimeout(() => (window.location.href = "confirm.html"), 500);
            });
        };
    } else {
        document.getElementById('globalModalBodyText').textContent = result.message;
        document.getElementById('confirmationCodeField').classList.add('d-none');
        document.getElementById('globalModalFooter').innerHTML = "";
        if (result.message === "Email already registered.") {
            const footer = document.getElementById('globalModalFooter');
            footer.innerHTML = `
        <button type="button" 
                class="btn btn-outline-secondary" 
                id="modalLoginBtn" 
                data-bs-dismiss="modal">
            Login
        </button>
    `;

            const modalEl = document.getElementById('globalModal');
            const modal = new bootstrap.Modal(modalEl);
            modal.show();

            document.getElementById('modalLoginBtn').addEventListener('click', () => {
                // Wait until modal is hidden
                modalEl.addEventListener('hidden.bs.modal', () => {
                    // 🔹 Force remove stuck backdrop & unlock scroll
                    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('padding-right');

                    // ✅ Desktop toggle
                    toggleMode(false);

                    // ✅ Mobile toggle
                    const mobileSignupBtn = document.getElementById("mobileSignupBtn");
                    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
                    const signupPanel = document.getElementById("signupPanel");
                    const loginPanel = document.getElementById("loginPanel");

                    if (window.innerWidth <= 600 && mobileSignupBtn && mobileLoginBtn && signupPanel && loginPanel) {
                        mobileLoginBtn.classList.add("login-active");
                        mobileLoginBtn.classList.remove("inactive", "signup-active");
                        mobileSignupBtn.classList.add("inactive");
                        mobileSignupBtn.classList.remove("signup-active", "login-active");

                        loginPanel.style.display = "";
                        signupPanel.style.display = "none";
                    }
                }, { once: true });
            });
        }

        else if (result.message === "Username already taken.") {
            // Handle specific case for username already taken
            const footer = document.getElementById('globalModalFooter');
            footer.innerHTML = `
            <button type="button" class="btn btn-outline-secondary" id="modalLoginBtn" data-bs-dismiss="modal">
                Ok
            </button>
        `;
        }
        new bootstrap.Modal(document.getElementById('globalModal')).show();
    }
});
