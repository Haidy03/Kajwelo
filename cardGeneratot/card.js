const products=[
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Nike"},
    {title:"blouse",currentprice:200,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"LC"},
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Defacto"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Adidas"},
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Nike"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"LC"},
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Defacto"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Adidas"}
];


window.addEventListener("load",function()
{
    const section=this.document.getElementById("productssection");
    section.classList.add("best-sellers");

    const sectionheader=this.document.createElement("div");         //div for header
    sectionheader.classList.add("section-header");
    const header=this.document.createElement("h2");         // header content
    header.classList.add("section-title");
    header.textContent="women section";

    sectionheader.appendChild(header);

    const grid=document.createElement("grid");             //container for all cards
    console.log(grid);
    grid.classList.add("products-grid");

    products.forEach(product => {
        const card=this.document.createElement("div");              //card element
        card.classList.add("product-card");

        const imagecontainer=this.document.createElement("div");             // image div for this card
        imagecontainer.classList.add("product-image");
       
        const badge= document.createElement("div");
        badge.className="product-badge";
        
        const overlay=document.createElement("div");
        overlay.className="product-overlay";

        const whishListBtn=this.document.createElement("button");
        whishListBtn.className="wishlist-btn";
        whishListBtn.textContent="♡";

        

        const quickViewBtn=this.document.createElement("button");
        quickViewBtn.className="quick-view-btn";
        quickViewBtn.textContent="";
        quickViewBtn.innerHTML=`<i class="fa-solid fa-cart-shopping"></i> Add to Cart`

        overlay.appendChild(quickViewBtn);
        overlay.appendChild(whishListBtn);

        const image=this.document.createElement("img");                     //the image
        image.src=product.image;
        image.style.width="100%";
        image.style.height="100%";
        
        imagecontainer.appendChild(image);
        imagecontainer.appendChild(overlay);

        const info=this.document.createElement("div");                      //div for the info about the product
        info.classList.add("product-info");

        const protitle=document.createElement("h4");                            // h4 for the product title
        protitle.classList.add("product-title");
        protitle.textContent=product.title;
        

        const proBrand=document.createElement("p");                       //  Parag for the product brand                  
        proBrand.classList.add("product-brand");
        proBrand.textContent=product.brand;


        const ProPrice=this.document.createElement("div");  // Div for the product price=>contains the product old and current prices
        ProPrice.classList.add("product-price");

        const ProCurrentPrice=this.document.createElement("span");     //span for the current price
        ProCurrentPrice.classList.add("current-price");
        ProCurrentPrice.textContent=product.currentprice+" $";

        const ProOldPrice=this.document.createElement("span");     //span for the old price
        ProOldPrice.classList.add("old-price");
        ProOldPrice.textContent=product.oldprice;



        ProPrice.appendChild(ProCurrentPrice);
        ProPrice.appendChild(ProOldPrice);

        



        info.appendChild(protitle);
        info.appendChild(proBrand);
        info.appendChild(ProPrice);



        card.appendChild(imagecontainer);
        card.appendChild(info);

        grid.appendChild(card);
    
        section.appendChild(sectionheader);
        section.appendChild(grid);
        

    });     //end of loop

   

}); //end of window load
