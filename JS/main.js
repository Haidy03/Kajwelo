import { topbar } from '../components/topbar.js';
import { navbar } from '../components/navbar.js';
import { footer } from '../components/footer.js';

// Load components into their placeholders
function loadComponents() {
    if(document.getElementById('topbar-placeholder')) 
        document.getElementById('topbar-placeholder').innerHTML = topbar;
  document.getElementById('navbar-placeholder').innerHTML = navbar;
  document.getElementById('footer-placeholder').innerHTML = footer;

  // Initialize scroll behavior
  initScrollBehavior();
}

// Initialize scroll behavior (moved from your script tag)
function initScrollBehavior() {
  const topbar = document.querySelector(".topbar");
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;
  const scrollThreshold = 20;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      topbar.classList.add("hide");
    } else {
      topbar.classList.remove("hide");
    }
    navbar.classList.toggle("scrolled", currentScroll > 50);
    lastScroll = currentScroll;
  });
}

// Load components when DOM is ready
document.addEventListener("DOMContentLoaded", loadComponents);