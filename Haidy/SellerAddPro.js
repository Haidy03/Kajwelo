
 //                         My own scriptt
window.addEventListener("load",function()
{
    const dashboardbtns=document.querySelectorAll(".dashboard-btn");
    const addStockBtn=this.document.getElementById("addStockBtn");
    const mainprice=this.document.getElementById("mainPriceId"); 
    const salePrice=this.document.getElementById("salePriceId"); 
    var error=this.document.getElementById("errordiv") ;
    var error2=this.document.getElementById("errordiv2") ;


//   Validation for the price
    mainprice.addEventListener("change",function()
{
    if(mainprice.value<0)
    {
        mainprice.classList.add("error");
        error.style.display="block";
        mainprice.value=0;    
        
    }
    else if(mainprice.value>=0)
    {
        mainprice.classList.remove("error");
        error.style.display="none";
    }
});     //main price end

    salePrice.addEventListener("change",function()
{
    if(salePrice.value<0)
    {
        salePrice.classList.add("error");
        error2.style.display="block";
        salePrice.value=0.0;    
        
    }
    else if(salePrice.value>=0)
    {
        salePrice.classList.remove("error");
        error2.style.display="none";
    }
});     //sale price end


    
    dashboardbtns.forEach(btn => {
        btn.addEventListener("click",function(){
            window.location.href="sellerdashboard.html";
        })
         
    });
    

    const AddProdBtn=document.getElementById("AddProdBtn");
    AddProdBtn.addEventListener("click",function()
        {
            window.location.href="addProductSeller.html";
        });


    
        var allowedSizes = ["XS", "S", "M", "L", "XL", "2XL","3XL"];
        var validColors = [
    "black", "white", "gray", "silver", "red", "maroon", "crimson", "salmon",
    "orange", "coral", "yellow", "gold", "green", "lime",
    "blue", "navy", "skyblue", "azure", "royalblue", "teal", "turquoise", "aqua",
    "purple", "violet", "lavender", "indigo", "plum", "magenta", "fuchsia",
    "pink", "hotpink", "brown", "chocolate", "tan", "beige"];



        document.getElementById('addStockBtn').addEventListener('click', function() {
        // Generate a unique ID for each entry
        const entryId = Date.now();
        
        // Generate size options HTML
        let sizeOptions = '<option value="">Select Size</option>';
        for (let i = 0; i < allowedSizes.length; i++) {
            sizeOptions += `<option value="${allowedSizes[i]}">${allowedSizes[i]}</option>`;
        }
        
        // Generate color options HTML
        let colorOptions = '<option value="">Select Color</option>';
        for (let i = 0; i < validColors.length; i++) {
            // Capitalize first letter for display
            const colorName = validColors[i].charAt(0).toUpperCase() + validColors[i].slice(1);
            colorOptions += `<option value="${validColors[i]}">${colorName}</option>`;
        }
        
        // Create the HTML for a new stock item
        const stockItemHTML = `
            <div class="form-row one-cols" data-id="${entryId}">
                <div class="stock-item">
                    <div class="form-group">
                        <label class="form-label">Size</label>
                        <select class="form-input form-select size-select">
                            ${sizeOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <select class="form-input form-select color-select">
                            ${colorOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input quantity-input" min="0" value="0">
                    </div>
                    <button type="button" class="remove-stock" onclick="removeStockEntry('${entryId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add the new stock item to the container
        document.getElementById('stockItemsContainer').insertAdjacentHTML('beforeend', stockItemHTML);
    });
    
    // Function to remove stock entries
    window.removeStockEntry = function(entryId) {
        const entry = document.querySelector(`[data-id="${entryId}"]`);
        if (entry) {
            entry.remove();
        }
    }


   

    
        
});     //END OF WINDOW LOAD
