const deleteBtn = document.getElementById("deleteAccountBtn");
const deletePasswordInput = document.getElementById("deletePassword");
const deleteStatus = document.getElementById("deleteStatus");

if (deleteBtn) {
  deleteBtn.addEventListener("click", function () {
    const enteredPassword = document.getElementById("deletePassword").value;
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!loggedInUser) {
      document.getElementById("deleteStatus").textContent =
        "No user is currently logged in.";
      return;
    }

    // Decode stored password before comparison
    if (atob(loggedInUser.password) !== enteredPassword) {
      document.getElementById("deleteStatus").textContent =
        "Incorrect password!";
      return;
    }

    // Remove user
    localStorage.removeItem("loggedInUser");
    users = users.filter((u) => u.id !== loggedInUser.id);
    localStorage.setItem("users", JSON.stringify(users));

    // Redirect
    window.location.href = "/FinalHomePage.html";
  });
}
