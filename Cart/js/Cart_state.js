const cartState = {
    items: [],
    subtotal: 0,
    deliveryCost: 0,
    total: 0,

    init: function() {
        this.loadSampleItems();
        this.updateUI();
    },

    loadSampleItems: function() {
        this.items = [...sampleItems]; // Create a copy of the sample items
    },

    // ... (all other methods remain exactly the same as in the original) ...
    calculateSubtotal: function() {
        this.subtotal = this.items.reduce((total, item) => {
            return total + (this.getFinalPrice(item) * item.quantity);
        }, 0);
    },

    calculateDeliveryCost: function() {
        this.deliveryCost = this.items.reduce((max, item) => {
            return Math.max(max, item.deliveryPrice || 0);
        }, 0);
    },

    calculateTotal: function() {
        this.total = this.subtotal + this.deliveryCost;
    },

    getDeliveryInfo: function() {
        if (this.items.length === 0) return "";

        const allFreeDelivery = this.items.every(item => item.deliveryPrice === 0);
        if (allFreeDelivery) {
            return "All items qualify for free delivery";
        }

        const hasFreeDelivery = this.items.some(item => item.deliveryPrice === 0);
        const hasPaidDelivery = this.items.some(item => item.deliveryPrice > 0);

        if (hasFreeDelivery && hasPaidDelivery) {
            return "Some items have additional delivery charges";
        }

        return "Express delivery applied";
    },

    getFinalPrice: function(item) {
        return item.price * (1 - (item.discount / 100));
    },

    updateUI: function() {
        this.calculateSubtotal();
        this.calculateDeliveryCost();
        this.calculateTotal();
        this.renderCartItems();
        this.updateSummary();
    },

    renderCartItems: function() {
        const container = document.getElementById('cart-items-container');

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-message d-flex justify-content-center align-items-center">
                    <h4 class="text-muted">Your cart is empty</h4>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        this.items.forEach(item => {
            const finalPrice = this.getFinalPrice(item);
            const stockWarning = item.stock < 10 ?
                `<p class="stock-warning mb-1">
                    <i class="fas fa-exclamation-circle"></i>
                    Only ${item.stock} left in stock
                </p>` :
                `<a href="#" class="text-decoration-none">View product details</a>`;

            const deliveryInfo = item.deliveryPrice > 0 ?
                `<p class="text-muted small mb-1"><i class="fas fa-truck"></i> ${item.deliveryInfo}</p>` :
                `<p class="text-success small mb-1"><i class="fas fa-check-circle"></i> Free delivery</p>`;

            const itemElement = document.createElement('div');
            itemElement.className = 'card mb-3';
            itemElement.dataset.id = item.id;
            itemElement.innerHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid product-image rounded">
                        </div>
                        <div class="col-md-6">
                            <h5 class="product-name">${item.name}</h5>
                            <p class="mb-1">Size: ${item.size}</p>
                            ${deliveryInfo}
                            ${stockWarning}
                        </div>
                        <div class="col-md-3 text-end">
                            <p class="product-price mb-1">EGP ${finalPrice.toFixed(2)}</p>
                            <p class="text-muted small mb-2">
                                <span class="original-price">EGP ${item.price.toFixed(2)}</span>
                                <span class="badge bg-success discount-badge ms-1">${item.discount}% OFF</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn text-danger p-0 remove-item" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                        <div class="d-flex align-items-center quantity-control">
                            <button class="btn btn-outline-secondary decrease-quantity" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2 quantity">${item.quantity}</span>
                            <button class="btn btn-outline-secondary increase-quantity" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(itemElement);
        });
    },

    updateSummary: function() {
        document.getElementById('cart-count').textContent = this.items.length;
        document.getElementById('cart-subtotal').textContent = this.subtotal.toFixed(2);
        document.getElementById('delivery-cost').textContent = this.deliveryCost.toFixed(2);
        document.getElementById('cart-total').textContent = this.total.toFixed(2);

        document.getElementById('delivery-info').textContent = this.getDeliveryInfo();

        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.disabled = this.items.length === 0;

        const deliveryCostElement = document.getElementById('delivery-cost');
        if (this.deliveryCost > 0) {
            deliveryCostElement.classList.remove('text-success');
        } else {
            deliveryCostElement.classList.add('text-success');
            deliveryCostElement.textContent = 'Free';
        }
    },

    removeItem: function(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updateUI();
    },

    increaseQuantity: function(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item && item.quantity < item.stock) {
            item.quantity++;
            this.updateUI();
        } else {
            alert("Cannot add more than available stock");
        }
    },

    decreaseQuantity: function(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.updateUI();
        } else if (item && item.quantity === 1) {
            if (confirm("Remove this item from your cart?")) {
                this.removeItem(itemId);
            }
        }
    },

    checkout: function() {
        if (this.items.length > 0) {
            alert(`Proceeding to checkout with total: EGP ${this.total.toFixed(2)}`);
        }
    }
};