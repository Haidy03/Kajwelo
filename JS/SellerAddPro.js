
 //                         My own scriptt
window.addEventListener("load",function()
{
    const dashboardbtns=document.querySelectorAll(".dashboard-btn");
    const addStockBtn=this.document.getElementById("addStockBtn");

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


//     const colorinput=this.document.getElementById("colorInput");
//     colorinput.addEventListener("change",function(e)
// {
    
//         if(colorinput.value!=="red")
//         {
//             alert("not valid");
//         }
//         else{
//             alert("valid");
//     }
    
// });
    



addStockBtn.addEventListener("click",function()
{
    const stockdiv=document.createElement("div");
    stockdiv.classList.add="stock-grid";

    stockdiv.innerHTML= `
    <div class="stock-item">
                    <div class="form-group">
                        <label class="form-label">Size</label>
                        <select class="form-input form-select" onchange="updateStockEntry('${entry.id}', 'size', this.value)">
                            <option value="">Select Size</option>
                            ${availableSizes.map(size => 
                                `<option value="${size}" ${entry.size === size ? 'selected' : ''}>${size}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <select class="form-input form-select" onchange="updateStockEntry('${entry.id}', 'color', this.value)">
                            <option value="">Select Color</option>
                            ${availableColors.map(color => 
                                `<option value="${color}" ${entry.color === color ? 'selected' : ''}>${color}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input" min="0" value="${entry.quantity}" 
                               onchange="updateStockEntry('${entry.id}', 'quantity', parseInt(this.value))">
                    </div>
                    <button type="button" class="remove-stock" onclick="removeStockEntry('${entry.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;

    const itemdiv=document.createElement("div");
    itemdiv.classList.add="stock-item";

    const itemdiv=document.createElement("div");
    itemdiv.classList.add="stock-item";
    const itemdiv=document.createElement("div");
    itemdiv.classList.add="stock-item";


})









        
});     //END OF WINDOW LOAD
