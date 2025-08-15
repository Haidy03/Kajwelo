




window.addEventListener("load",function()
{
    const addProductBtn=document.getElementById("addproductbtn");
    const AddProdBtn=document.getElementById("AddProdBtn");
    const DashboardBtn=document.getElementById("DashboardBtn");

    

    addProductBtn.addEventListener("click",function()
    {
        window.location.href="SelleraAddProduct.html";
    });
    AddProdBtn.addEventListener("click",function()
    {
        window.location.href="SelleraAddProduct.html";
    });
    DashboardBtn.addEventListener("click",function()
    {
        window.location.href="sellerdashboard.html";
    });

   

});
