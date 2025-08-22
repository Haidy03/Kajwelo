class ProfessionalSlider {
    constructor(container, images, options = {}) {
        this.container = container;
        this.images = images;
        this.currentIndex = 0;
        this.isPlaying = true;
        this.isTransitioning = false;
        
        // Options with defaults
        this.options = {
            interval: options.interval || 5000,
            transitionDuration: options.transitionDuration || 800,
            autoPlay: options.autoPlay !== false,
            showDots: options.showDots !== false,
            showArrows: false, // Always false - no arrows
            showProgress: options.showProgress !== false,
            pauseOnHover: options.pauseOnHover !== false
        };
        
        this.init();
    }
    
    init() {
        this.createSliderStructure();
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateSlider();
    }
    
    createSliderStructure() {
        // Create slider wrapper
        this.sliderWrapper = document.createElement('div');
        this.sliderWrapper.className = 'slider-wrapper';
        this.sliderWrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create slides container
        this.slidesContainer = document.createElement('div');
        this.slidesContainer.className = 'slider-slides';
        this.slidesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        
        // Create slides
        this.slides = this.images.map((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slider-slide';
            slide.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url(${image});
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                opacity: ${index === 0 ? '1' : '0'};
                transition: opacity ${this.options.transitionDuration}ms ease-in-out;
                z-index: ${index === 0 ? '2' : '1'};
            `;
            return slide;
        });
        
        // Add slides to container
        this.slides.forEach(slide => {
            this.slidesContainer.appendChild(slide);
        });
        
        // Create navigation dots
        if (this.options.showDots) {
            this.dotsContainer = document.createElement('div');
            this.dotsContainer.className = 'slider-dots';
            this.dotsContainer.style.cssText = `
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 12px;
                z-index: 10;
            `;
            
            // Responsive styles for mobile
            if (window.innerWidth <= 768) {
                this.dotsContainer.style.bottom = '20px';
                this.dotsContainer.style.gap = '8px';
            }
            
            this.dots = this.images.map((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.setAttribute('data-index', index);
                dot.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.7);
                    background: ${index === 0 ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
                    cursor: pointer;
                    transition: all 0.3s ease;
                    outline: none;
                `;
                
                dot.addEventListener('mouseenter', () => {
                    dot.style.transform = 'scale(1.2)';
                });
                
                dot.addEventListener('mouseleave', () => {
                    dot.style.transform = 'scale(1)';
                });
                
                return dot;
            });
            
            this.dots.forEach(dot => {
                this.dotsContainer.appendChild(dot);
            });
        }
        
        // Create progress bar
        if (this.options.showProgress) {
            this.progressContainer = document.createElement('div');
            this.progressContainer.className = 'slider-progress';
            this.progressContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                z-index: 10;
            `;
            
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'slider-progress-bar';
            this.progressBar.style.cssText = `
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                width: 0%;
                transition: width linear ${this.options.interval}ms;
            `;
            
            this.progressContainer.appendChild(this.progressBar);
        }
        
        // Assemble slider
        this.sliderWrapper.appendChild(this.slidesContainer);
        if (this.options.showDots) this.sliderWrapper.appendChild(this.dotsContainer);
        if (this.options.showProgress) this.sliderWrapper.appendChild(this.progressContainer);
        
        // Preserve hero content and add slider as background
        const heroContent = this.container.querySelector('.hero-content');
        if (heroContent) {
            // Style hero content to appear above slider
            heroContent.style.cssText = `
                position: relative;
                z-index: 5;
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
                color: white;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            `;
            // Move hero content to slider wrapper
            this.sliderWrapper.appendChild(heroContent);
        }
        
        // Clear container and add slider wrapper
        this.container.innerHTML = '';
        this.container.appendChild(this.sliderWrapper);
    }
    
    setupEventListeners() {
        // Dot navigation
        if (this.options.showDots) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });
        }
        
        // Pause on hover
        if (this.options.pauseOnHover) {
            this.sliderWrapper.addEventListener('mouseenter', () => {
                this.pause();
            });
            
            this.sliderWrapper.addEventListener('mouseleave', () => {
                this.resume();
            });
        }
        
        // Keyboard navigation (only for dots)
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });
    }
    
    updateSlider() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.style.opacity = index === this.currentIndex ? '1' : '0';
            slide.style.zIndex = index === this.currentIndex ? '2' : '1';
        });
        
        // Update dots
        if (this.options.showDots) {
            this.dots.forEach((dot, index) => {
                dot.style.background = index === this.currentIndex ? 'rgba(255, 255, 255, 0.9)' : 'transparent';
            });
        }
        
        // Reset progress bar
        if (this.options.showProgress) {
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = '0%';
            setTimeout(() => {
                this.progressBar.style.transition = `width linear ${this.options.interval}ms`;
                this.progressBar.style.width = '100%';
            }, 10);
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlider();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.updateSlider();
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        if (!this.options.autoPlay) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, this.options.interval);
    }
    
    pause() {
        this.isPlaying = false;
        if (this.options.showProgress) {
            this.progressBar.style.transition = 'none';
        }
    }
    
    resume() {
        this.isPlaying = true;
        if (this.options.showProgress) {
            this.progressBar.style.transition = `width linear ${this.options.interval}ms`;
            this.progressBar.style.width = '100%';
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }
    
    resetAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.startAutoPlay();
        }
    }
    
    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize the professional slider
document.addEventListener('DOMContentLoaded', function() {
    const images = [
        "/images/slider3.jpg", 
        "/images/slider1.jpg", 
        "/images/slider2.jpg",
        "/images/slider4.jpg",
        "/images/slider5.jpg"
    ];
    
    const hero = document.querySelector(".hero");
    
    if (hero) {
        new ProfessionalSlider(hero, images, {
            interval: 5000,           // 5 seconds per slide
            transitionDuration: 800,  // 800ms transition
            autoPlay: true,           // Enable auto-play
            showDots: true,           // Show navigation dots
            showArrows: false,        // No arrows
            showProgress: true,       // Show progress bar
            pauseOnHover: true        // Pause on hover
        });
    }
});


