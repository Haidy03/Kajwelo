// charts.js
// --------------------------------------
// A helper module to generate charts for Admin & Seller dashboards
// using Chart.js with your Storage + User model design
// --------------------------------------

import { Storage } from "../utils/localStorageHelper.js";
import { Admin } from "../models/Admin.js"
import { Seller } from "../models/Seller.js";
import { Customer } from "../models/Customer.js";



// Utility to safely destroy old chart before re-render
function renderChart(ctx, config) {
  if (ctx._chartInstance) {
    ctx._chartInstance.destroy();
  }
  ctx._chartInstance = new Chart(ctx, config);
  return ctx._chartInstance;
}

export class Charts {
  // ---------------- SELLER DASHBOARD ----------------
  // Show a bar chart of earnings per product
  static renderSellerEarningsChart(sellerId, canvasId) {
    const users = Storage.get("users", []);
    const seller = users.find(u => u instanceof Seller && u.id === sellerId);
    if (!seller) return;

    // Prepare labels (product names) & data (earnings)
    const labels = seller.products.map(p => p.name);
    const data = seller.products.map(p => p.earnings || 0);

    const ctx = document.getElementById(canvasId).getContext("2d");
    return renderChart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Earnings (EGP)",
          data,
          backgroundColor: "rgba(54, 235, 154, 0.6)",
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Earnings per Product" }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // ---------------- ADMIN DASHBOARD ----------------
  // Show a pie chart of verified vs pending products across all sellers
  static renderAdminProductVerificationChart(canvasId) {
    const users = Storage.get("users", []);
    const sellers = users.filter(u => u instanceof Seller);
    
    let verified = 0, pending = 0;
    sellers.forEach(s => {
      s.products.forEach(p => {
        if (p.isVerified) verified++;
        else pending++;
      });
    });

    const ctx = document.getElementById(canvasId).getContext("2d");
    return renderChart(ctx, {
      type: "pie",
      data: {
        labels: ["Verified Products", "Pending Products"],
        datasets: [{
          data: [verified, pending],
          backgroundColor: ["#4CAF50", "#FFC107"]
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: "Product Verification Status" }
        }
      }
    });
  }

  // ---------------- ADMIN DASHBOARD ----------------
  // Show a bar chart of total sales (earnings) by seller
  static renderAdminSalesBySellerChart(canvasId) {
    const users = Storage.get("users", []);
    const sellers = users.filter(u => u instanceof Seller);

    const labels = sellers.map(s => s.brandName || s.name);
    const data = sellers.map(s => s.earnings || 0);

    const ctx = document.getElementById(canvasId).getContext("2d");
    return renderChart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Total Earnings (EGP)",
          data,
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Sales by Seller" }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
