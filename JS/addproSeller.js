
        //                         My own scriptt
window.addEventListener("load",function()
{
    const dashboardbtns=document.querySelectorAll(".dashboard-btn");

    dashboardbtns.forEach(btn => {
        btn.addEventListener("click",function(){
            window.location.href="sellerdashboard.html";
        })
         
    });
    // const DashBoardtBtn=document.getElementById("DashBoardBtn");
    // DashBoardtBtn.addEventListener("click",function()
    //     {
    //         window.location.href="sellerdashboard.html";
    //     });

    const AddProdBtn=document.getElementById("AddProdBtn");
    AddProdBtn.addEventListener("click",function()
        {
            window.location.href="addProductSeller.html";
        });














        
});     //END OF WINDOW LOAD
