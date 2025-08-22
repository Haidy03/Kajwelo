window.addEventListener("load", function () {



    const addProductBtn = document.getElementById("addproductbtn");
    const AddProdBtn = document.getElementById("AddProdBtn");
    const DashboardBtn = document.getElementById("DashBtn");
    const InventoryBtn = document.getElementById("InventoryBtn");



    // addProductBtn.addEventListener("click",function()
    // {
    //     window.location.href="SelleraAddProduct.html";
    // });
    if (addProductBtn) AddProdBtn.addEventListener("click", function () {
        window.location.href = "SelleraAddProduct.html";
    });
    if (DashboardBtn) DashboardBtn.addEventListener("click", function () {
        window.location.href = "../Pages/sellerdashboard.html";
    });
    if (InventoryBtn) InventoryBtn.addEventListener("click", function () {
        window.location.href = "../Pages/SellerInventory.html";
    });



});