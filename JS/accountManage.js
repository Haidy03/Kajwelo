const accountForm = document.getElementById("accountForm");
const statusEl = document.getElementById("status");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const genderInputs = document.querySelectorAll('input[name="gender"]');

// Retrieve user from localStorage
let user = JSON.parse(localStorage.getItem("loggedInUser"));

// Populate form with existing data
function renderUserData() {
  if (!user) return;

  firstNameInput.value = user.firstName || "";
  lastNameInput.value = user.lastName || "";
  emailInput.value = user.email || "";
  phoneInput.value = user.phone || "";
  addressInput.value = user.address || "";

  passwordInput.value = user.password ? atob(user.password) : "";
  confirmPasswordInput.value = user.password ? atob(user.password) : "";

  if (user.gender) {
    genderInputs.forEach((radio) => {
      radio.checked = radio.value === user.gender;
    });
  }
}

// Call this on page load
renderUserData();

// Save updated data back to localStorage
accountForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (passwordInput.value !== confirmPasswordInput.value) {
    statusEl.textContent = "Passwords do not match!";
    statusEl.classList.replace("text-success", "text-danger");
    return;
  }

  // Update user object
  user.firstName = firstNameInput.value;
  user.lastName = lastNameInput.value;
  user.email = emailInput.value;
  user.phone = phoneInput.value;
  user.address = addressInput.value;
  user.password = btoa(passwordInput.value);
  user.confirmPassword = btoa(confirmPasswordInput.value);

  genderInputs.forEach((radio) => {
    if (radio.checked) {
      user.gender = radio.value;
    }
  });

  user.updatedAt = new Date().toISOString();
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  statusEl.textContent = "Profile updated successfully!";
  statusEl.classList.replace("text-danger", "text-success");
  setTimeout(() => (statusEl.textContent = ""), 3000);
});
