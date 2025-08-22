
    const images = ["/images/slider3.jpg", "/images/slider1.jpg", "/images/slider2.jpg","/images/slider4.jpg","/images/slider5.jpg"];
    let current = 0;
    const hero = document.querySelector(".hero");

    // 👇 Set the first image immediately when page loads
    hero.style.backgroundImage = `url(${images[current]})`;

    setInterval(() => {
    current = (current + 1) % images.length;
    hero.style.backgroundImage = `url(${images[current]})`;
    }, 4000);


