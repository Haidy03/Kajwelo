document.addEventListener('DOMContentLoaded', () => {
    cartState.init();

    document.getElementById('cart-items-container').addEventListener('click', (e) => {
        const itemId = parseInt(e.target.closest('[data-id]')?.dataset.id);
        if (!itemId) return;

        if (e.target.closest('.remove-item')) {
            cartState.removeItem(itemId);
        } else if (e.target.closest('.increase-quantity')) {
            cartState.increaseQuantity(itemId);
        } else if (e.target.closest('.decrease-quantity')) {
            cartState.decreaseQuantity(itemId);
        }
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        cartState.checkout();
    });
});