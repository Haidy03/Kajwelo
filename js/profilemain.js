const userData = {
  name: "Souhila Elsayed",
  email: "sohila.m7md365@gmail.com",
  shippingAddress: null,
  storeCredit: 0.0,
};

document.getElementById("accountName").innerText = userData.name;
document.getElementById("accountEmail").innerText = userData.email;
document.getElementById("shippingAddress").innerText = userData.shippingAddress
  ? userData.shippingAddress
  : "No default shipping address available.";
document.getElementById(
  "storeCredit"
).innerText = `Jumia store credit balance: EGP ${userData.storeCredit.toFixed(
  2
)}`;

console.log("done");
