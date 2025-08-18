// Get user data from localStorage
const storedUser = localStorage.getItem("loggedInUser");

if (storedUser) {
  try {
    const userData = JSON.parse(storedUser);

    // Display Account Details
    document.getElementById("accountName").innerText =
      userData.name || "No name found";
    document.getElementById("accountEmail").innerText =
      userData.email || "No email found";

    // Display Address Book
    document.getElementById("shippingAddress").innerText = userData.address
      ? userData.address
      : "No default shipping address available.";

    // Display Store Credit (you didn’t provide this field, so default to 0)
    const storeCredit = userData.storeCredit || 0;
    document.getElementById(
      "storeCredit"
    ).innerText = `Kajwelo store credit balance: EGP ${storeCredit.toFixed(2)}`;
  } catch (err) {
    console.error("Error parsing user data from localStorage:", err);
  }
} else {
  console.warn("No loggedInUser data found in localStorage.");
  document.getElementById("accountName").innerText = "Guest";
  document.getElementById("accountEmail").innerText = "Not available";
  document.getElementById("shippingAddress").innerText =
    "No default shipping address available.";
  document.getElementById("storeCredit").innerText =
    "Kajwelo store credit balance: EGP 0.00";
}
