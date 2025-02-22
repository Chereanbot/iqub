// Payment UI Handler
class PaymentUI {
    constructor() {
        this.bankingService = require('./banking');
    }

    async initializePayment(amount, userData) {
        try {
            // Show loading state
            this.showLoadingState();

            // Initialize payment
            const paymentResponse = await this.bankingService.chapaService.initiatePayment({
                amount: amount,
                currency: 'ETB',
                email: userData.email,
                first_name: userData.firstName,
                last_name: userData.lastName,
                callback_url: `${window.location.origin}/api/payment/callback`,
                return_url: `${window.location.origin}/dashboard`,
                customization: {
                    title: 'Bidir Payment',
                    description: `Payment of ${amount} ETB`
                }
            });

            // Redirect to Chapa checkout
            window.location.href = paymentResponse.checkoutUrl;
        } catch (error) {
            this.hideLoadingState();
            this.showError('Payment initialization failed. Please try again.');
            console.error('Payment error:', error);
        }
    }

    showLoadingState() {
        const loadingOverlay = document.getElementById('payment-loading');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoadingState() {
        const loadingOverlay = document.getElementById('payment-loading');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('payment-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
}

// Export the PaymentUI instance
window.PaymentUI = new PaymentUI(); 