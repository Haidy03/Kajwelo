// utils/cartManager.js
import { Storage } from "./localStorageHelper.js";

const CART_KEY = "cart";

export const CartManager = {
    getItems: function () {
        return Storage.get(CART_KEY, []);
    },

    addItem: function (product, qty = 1) {
        const cart = this.getItems();
        const index = cart.findIndex(item => item.id === product.id);

        if (index !== -1) {
            cart[index].qty += qty;
        } else {
            cart.push({ ...product, qty });
        }

        Storage.set(CART_KEY, cart);
    },

    updateQty: function (productId, newQty) {
        const cart = this.getItems();
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            if (newQty <= 0) {
                cart.splice(index, 1); // remove item
            } else {
                cart[index].qty = newQty;
            }
            Storage.set(CART_KEY, cart);
        }
    },

    removeItem: function (productId) {
        const cart = this.getItems().filter(item => item.id !== productId);
        Storage.set(CART_KEY, cart);
    },

    clearCart: function () {
        Storage.remove(CART_KEY);
    },

    getTotalItems: function () {
        return this.getItems().reduce((sum, item) => sum + item.qty, 0);
    },

    getTotalPrice: function () {
        return this.getItems().reduce((sum, item) => sum + item.price * item.qty, 0);
    }
};
