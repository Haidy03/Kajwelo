const products=[
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Nike"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"LC"},
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Defacto"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Adidas"},
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Nike"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"LC"},
    {title:"Dress",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Defacto"},
    {title:"blouse",currentprice:300,oldprice:400,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9VFELQHCzhK8Gpsw7rO7ZX3xkdLgEslcVQ&s",brand:"Adidas"}
];


window.addEventListener("load",function()
{
    const grid=document.getElementById("grid");             //container for all cards
    console.log(grid);
    grid.classList.add("products-grid");

    products.forEach(product => {
        const card=this.document.createElement("div");              //card element
        card.classList.add("product-card");

        const imagecontainer=this.document.createElement("div");             // image div for this card
        imagecontainer.classList.add("product-image");
       
     
     
        const image=this.document.createElement("img");                     //the image
        image.src=product.image;
        image.style.width="100%";
        image.style.height="100%";
        
        imagecontainer.appendChild(image);

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
        ProCurrentPrice.textContent=product.currentprice;

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
    


    });     //end of loop

   

}); //end of window load
