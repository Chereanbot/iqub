// Deposit Handler
class DepositHandler {
    constructor() {
        this.initializeToasts();
        this.initializeDepositForm();
        this.loadingStates = {
            isProcessing: false
        };
    }

    initializeToasts() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }

    createToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                <div class="toast-header ${type === 'error' ? 'bg-danger text-white' : 'bg-primary text-white'}">
                    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                    <strong class="me-auto">${type === 'error' ? 'Error' : 'Information'}</strong>
                    <small>Just now</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        const container = document.getElementById('toast-container');
        container.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 5000 });
        toast.show();

        // Remove toast from DOM after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    showLoadingState() {
        const submitBtn = document.querySelector('#depositForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing Payment...
            `;
        }

        // Add loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="card border-0 bg-transparent">
                <div class="card-body text-center text-white">
                    <div class="spinner-border text-light mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h5 class="mb-0">Processing Your Deposit</h5>
                    <p class="mb-0">Please wait while we secure your transaction...</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hideLoadingState() {
        const submitBtn = document.querySelector('#depositForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i class="fas fa-lock me-2"></i>Proceed to Secure Payment
            `;
        }

        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    validateAmount(amount) {
        const minAmount = 1;
        const maxAmount = 1000000; // 1 million ETB
        
        if (isNaN(amount) || amount < minAmount) {
            throw new Error(`Minimum deposit amount is ${minAmount} ETB`);
        }
        if (amount > maxAmount) {
            throw new Error(`Maximum deposit amount is ${maxAmount.toLocaleString()} ETB`);
        }
    }

    async initializeDepositForm() {
        const form = document.getElementById('depositForm');
        if (!form) return;

        const amountInput = form.querySelector('#depositAmount');
        if (amountInput) {
            // Add input validation
            amountInput.addEventListener('input', (e) => {
                try {
                    this.validateAmount(e.target.value);
                    e.target.classList.remove('is-invalid');
                    e.target.classList.add('is-valid');
                } catch (error) {
                    e.target.classList.remove('is-valid');
                    e.target.classList.add('is-invalid');
                }
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.loadingStates.isProcessing) return;

            const amount = document.getElementById('depositAmount').value;
            
            try {
                this.validateAmount(amount);
                this.loadingStates.isProcessing = true;
                this.showLoadingState();

                // Show processing toast
                this.createToast('Initializing secure payment...', 'info');

                const userData = await window.PaymentUI.getUserData();
                await window.PaymentUI.initializePayment(amount, userData);

                // Note: Success toast will be shown after redirect back from Chapa
            } catch (error) {
                this.createToast(error.message || 'Failed to process deposit. Please try again.', 'error');
                this.loadingStates.isProcessing = false;
                this.hideLoadingState();
            }
        });
    }

    // Call this when returning from Chapa payment
    handlePaymentSuccess(transactionRef) {
        this.createToast('Payment processed successfully!', 'success');
        // Refresh account balance
        this.refreshAccountBalance();
    }

    async refreshAccountBalance() {
        try {
            const response = await fetch('/api/balance');
            const data = await response.json();
            if (data.success) {
                // Update all balance displays
                document.querySelectorAll('.balance-display').forEach(el => {
                    el.textContent = `ETB ${data.balance.toLocaleString()}`;
                });
                // Update chart if exists
                if (window.savingsChart) {
                    window.savingsChart.data.datasets[0].data.push(data.balance);
                    window.savingsChart.update();
                }
            }
        } catch (error) {
            console.error('Failed to refresh balance:', error);
        }
    }
}

// Initialize deposit handler
document.addEventListener('DOMContentLoaded', () => {
    window.depositHandler = new DepositHandler();
}); 