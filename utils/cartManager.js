// utils/cartManager.js
import { Storage } from "./localStorageHelper.js";

// Key used to store cart data in localStorage
const CART_KEY = "cart";

// CartManager handles all cart-related operations using localStorage
export const CartManager = {
    // Retrieves all items currently in the cart
    getItems: function () {
        return Storage.get(CART_KEY, []);
    },

    // Adds a product to the cart or updates its quantity if it already exists
    addItem: function (product, qty = 1) {
        const cart = this.getItems();
        const index = cart.findIndex(item => item.id === product.id);

        if (index !== -1) {
            // If product exists, increase its quantity
            cart[index].qty += qty;
        } else {
            // If product doesn't exist, add it to the cart
            cart.push({ ...product, qty });
        }

        Storage.set(CART_KEY, cart);
    },

    // Updates the quantity of a specific product in the cart
    updateQty: function (productId, newQty) {
        const cart = this.getItems();
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            if (newQty <= 0) {
                // Remove item if quantity is zero or less
                cart.splice(index, 1);
            } else {
                // Update item quantity
                cart[index].qty = newQty;
            }
            Storage.set(CART_KEY, cart);
        }
    },

    // Removes a product from the cart by its ID
    removeItem: function (productId) {
        const cart = this.getItems().filter(item => item.id !== productId);
        Storage.set(CART_KEY, cart);
    },

    // Clears the entire cart
    clearCart: function () {
        Storage.remove(CART_KEY);
    },

    // Returns the total number of items in the cart
    getTotalItems: function () {
        return this.getItems().reduce((sum, item) => sum + item.qty, 0);
    },

    // Returns the total price of all items in the cart
    getTotalPrice: function () {
        return this.getItems().reduce((sum, item) => sum + item.price * item.qty, 0);
    }
};

/*
🧪 Example Usage:

// Example 1: Add a product to the cart
CartManager.addItem({ id: 101, name: "Wireless Mouse", price: 250 }, 2);

// Example 2: Update quantity of a product
CartManager.updateQty(101, 3);
*/
