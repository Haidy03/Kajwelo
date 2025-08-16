document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment method fields
    document.getElementById('creditCardFields').classList.add('active');
    document.getElementById('cardNumber').required = true;
    document.getElementById('expiryDate').required = true;
    document.getElementById('cvv').required = true;
    document.getElementById('cardName').required = true;
    document.getElementById('paypalEmail').required = false;
    document.getElementById('paypalPassword').required = false;

    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.payment-method-fields').forEach(field => {
                field.classList.remove('active');
            });

            if (this.value === 'creditCard') {
                document.getElementById('creditCardFields').classList.add('active');
                document.getElementById('paypalEmail').required = false;
                document.getElementById('paypalPassword').required = false;
                document.getElementById('cardNumber').required = true;
                document.getElementById('expiryDate').required = true;
                document.getElementById('cvv').required = true;
                document.getElementById('cardName').required = true;
            } else {
                document.getElementById('paypalFields').classList.add('active');
                document.getElementById('cardNumber').required = false;
                document.getElementById('expiryDate').required = false;
                document.getElementById('cvv').required = false;
                document.getElementById('cardName').required = false;
                document.getElementById('paypalEmail').required = true;
                document.getElementById('paypalPassword').required = true;
            }
        });
    });

    // Form validation and submission
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (paymentMethod === 'creditCard') {
            alert('Processing credit card payment...');
        } else {
            alert('Redirecting to PayPal...');
        }
    });

    // Real-time validation for some fields
    document.getElementById('phone').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    document.getElementById('cardNumber').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9\s]/g, '');
    });

    document.getElementById('expiryDate').addEventListener('input', function() {
        let value = this.value.replace(/[^0-9\/]/g, '');
        if (value.length > 2 && !value.includes('/')) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        this.value = value;
    });

    document.getElementById('cvv').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});