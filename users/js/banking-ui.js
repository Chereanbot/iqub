// Banking UI Operations
class BankingUI {
    constructor() {
        this.initializeEventListeners();
        // Add payment loading overlay
        this.addPaymentOverlay();
    }

    addPaymentOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'payment-loading';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        overlay.innerHTML = `
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add payment error element
        const errorDiv = document.createElement('div');
        errorDiv.id = 'payment-error';
        errorDiv.className = 'alert alert-danger';
        errorDiv.style.display = 'none';
        document.body.appendChild(errorDiv);
    }

    initializeEventListeners() {
        // Loan Application
        const loanForm = document.getElementById('loanApplicationForm');
        if (loanForm) {
            loanForm.addEventListener('submit', this.handleLoanApplication.bind(this));
        }

        // Withdrawal
        const withdrawalForm = document.getElementById('withdrawalForm');
        if (withdrawalForm) {
            withdrawalForm.addEventListener('submit', this.handleWithdrawal.bind(this));
        }

        // Statement Generation
        const statementForm = document.getElementById('statementForm');
        if (statementForm) {
            statementForm.addEventListener('submit', this.handleStatementGeneration.bind(this));
        }

        // Payment Form
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', this.handlePayment.bind(this));
        }
    }

    // Loan Application Handler
    async handleLoanApplication(event) {
        event.preventDefault();
        try {
            const amount = document.getElementById('loanAmount').value;
            const term = document.getElementById('loanTerm').value;

            const response = await fetch('/api/loans/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, term })
            });

            const data = await response.json();
            if (data.success) {
                this.showSuccessMessage('Loan application submitted successfully');
                // Update UI with loan details
                this.updateLoanStatus(data.loan);
            } else {
                this.showErrorMessage(data.error);
            }
        } catch (error) {
            this.showErrorMessage('Failed to submit loan application');
        }
    }

    // Withdrawal Handler
    async handleWithdrawal(event) {
        event.preventDefault();
        try {
            const amount = document.getElementById('withdrawalAmount').value;

            const response = await fetch('/api/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            const data = await response.json();
            if (data.success) {
                this.showSuccessMessage('Withdrawal processed successfully');
                // Update UI with new balance
                this.updateBalance();
            } else {
                this.showErrorMessage(data.error);
            }
        } catch (error) {
            this.showErrorMessage('Failed to process withdrawal');
        }
    }

    // Statement Generation Handler
    async handleStatementGeneration(event) {
        event.preventDefault();
        try {
            const startDate = document.getElementById('statementStartDate').value;
            const endDate = document.getElementById('statementEndDate').value;

            const response = await fetch(`/api/statements?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();

            if (data.success) {
                this.displayStatement(data.statement);
            } else {
                this.showErrorMessage(data.error);
            }
        } catch (error) {
            this.showErrorMessage('Failed to generate statement');
        }
    }

    // Payment Handler
    async handlePayment(event) {
        event.preventDefault();
        try {
            const amount = document.getElementById('paymentAmount').value;
            const userData = await this.getUserData();

            // Initialize payment using PaymentUI
            await window.PaymentUI.initializePayment(amount, userData);
        } catch (error) {
            this.showErrorMessage('Failed to initialize payment');
            console.error('Payment error:', error);
        }
    }

    async getUserData() {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();
            return {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName
            };
        } catch (error) {
            throw new Error('Failed to fetch user data');
        }
    }

    // UI Update Methods
    updateLoanStatus(loan) {
        const loanStatusElement = document.getElementById('loanStatus');
        if (loanStatusElement) {
            loanStatusElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Loan Details</h5>
                        <p>Amount: ETB ${loan.amount}</p>
                        <p>Term: ${loan.term} months</p>
                        <p>Monthly Payment: ETB ${loan.monthlyPayment}</p>
                        <p>Status: ${loan.status}</p>
                    </div>
                </div>
            `;
        }
    }

    async updateBalance() {
        try {
            const response = await fetch('/api/balance');
            const data = await response.json();

            if (data.success) {
                const balanceElement = document.getElementById('accountBalance');
                if (balanceElement) {
                    balanceElement.textContent = `ETB ${data.balance}`;
                }
            }
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    }

    displayStatement(statement) {
        const statementContainer = document.getElementById('statementContainer');
        if (statementContainer) {
            statementContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Statement: ${statement.statementId}</h5>
                        <p class="text-muted">Period: ${new Date(statement.period.startDate).toLocaleDateString()} - ${new Date(statement.period.endDate).toLocaleDateString()}</p>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6>Savings Balance</h6>
                                <p class="h4">ETB ${statement.balances.savings}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Loan Balance</h6>
                                <p class="h4">ETB ${statement.balances.loan}</p>
                            </div>
                        </div>
                        
                        <h6>Transactions</h6>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${statement.transactions.map(transaction => `
                                        <tr>
                                            <td>${new Date(transaction.date).toLocaleDateString()}</td>
                                            <td>${transaction.description}</td>
                                            <td>ETB ${transaction.amount}</td>
                                            <td>${transaction.type}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Utility Methods
    showSuccessMessage(message) {
        // Implement success toast/alert
        alert(message); // Replace with proper UI notification
    }

    showErrorMessage(message) {
        // Implement error toast/alert
        alert(message); // Replace with proper UI notification
    }
}

// Initialize Banking UI
document.addEventListener('DOMContentLoaded', () => {
    new BankingUI();
}); 