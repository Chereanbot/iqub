const ChapaPaymentService = require('./chapa-service');

// Banking Service Module
class BankingService {
    constructor() {
        this.chapaService = new ChapaPaymentService('CHASECK_TEST-cIE6IPsupgrF0aQnIU4cmK0PkeJBOfwX');
    }

    // Savings Management
    async processSavingsDeduction(employeeId, salary) {
        const deductionAmount = salary * 0.05; // 5% of salary
        try {
            const transaction = await this.chapaService.initiatePayment({
                amount: deductionAmount,
                currency: 'ETB',
                reference: `SAV-${employeeId}-${Date.now()}`,
                callback_url: '/api/transactions/verify',
                return_url: '/dashboard',
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email
            });
            
            return this.recordTransaction({
                type: 'SAVINGS',
                amount: deductionAmount,
                employeeId: employeeId,
                status: 'PENDING',
                reference: transaction.reference
            });
        } catch (error) {
            console.error('Savings deduction failed:', error);
            throw new Error('Failed to process savings deduction');
        }
    }

    // Loan Management
    async processLoanApplication(employeeId, amount, term) {
        try {
            // Verify eligibility
            const savings = await this.getTotalSavings(employeeId);
            const maxLoanAmount = savings * 5; // 5x savings rule
            
            if (amount > maxLoanAmount) {
                throw new Error('Loan amount exceeds maximum eligible amount');
            }

            // Calculate monthly interest (3%)
            const monthlyInterest = amount * 0.03;
            const monthlyPayment = (amount / term) + monthlyInterest;

            return this.createLoan({
                employeeId,
                amount,
                term,
                monthlyPayment,
                status: 'PENDING_APPROVAL',
                applicationDate: new Date()
            });
        } catch (error) {
            console.error('Loan application failed:', error);
            throw new Error('Failed to process loan application');
        }
    }

    // Withdrawal Processing
    async processWithdrawal(employeeId, amount) {
        try {
            const balance = await this.getAccountBalance(employeeId);
            if (amount > balance) {
                throw new Error('Insufficient funds');
            }

            // Create withdrawal record
            const withdrawal = await this.createTransaction({
                type: 'WITHDRAWAL',
                amount: amount,
                employeeId: employeeId,
                status: 'PENDING',
                reference: `WD-${employeeId}-${Date.now()}`
            });

            // Initiate bank transfer
            await this.chapaService.initiateTransfer({
                amount: amount,
                bank_account: user.bankAccount,
                reference: withdrawal.reference
            });

            return withdrawal;
        } catch (error) {
            console.error('Withdrawal failed:', error);
            throw new Error('Failed to process withdrawal');
        }
    }

    // Interest Calculation
    async calculateSavingsInterest(employeeId) {
        try {
            const savings = await this.getTotalSavings(employeeId);
            const annualRate = 0.079; // 7.9% annual interest
            const monthlyInterest = (savings * annualRate) / 12;

            return this.createTransaction({
                type: 'INTEREST_CREDIT',
                amount: monthlyInterest,
                employeeId: employeeId,
                status: 'COMPLETED',
                reference: `INT-${employeeId}-${Date.now()}`
            });
        } catch (error) {
            console.error('Interest calculation failed:', error);
            throw new Error('Failed to calculate interest');
        }
    }

    // Statement Generation
    async generateStatement(employeeId, startDate, endDate) {
        try {
            const transactions = await this.getTransactions(employeeId, startDate, endDate);
            const loans = await this.getLoans(employeeId, startDate, endDate);
            const savingsBalance = await this.getTotalSavings(employeeId);
            const loanBalance = await this.getTotalLoanBalance(employeeId);

            return {
                employeeId,
                period: { startDate, endDate },
                transactions,
                loans,
                balances: {
                    savings: savingsBalance,
                    loan: loanBalance
                },
                generatedAt: new Date(),
                statementId: `ST-${employeeId}-${Date.now()}`
            };
        } catch (error) {
            console.error('Statement generation failed:', error);
            throw new Error('Failed to generate statement');
        }
    }

    // Helper Methods
    async getAccountBalance(employeeId) {
        // Implement balance check
    }

    async getTotalSavings(employeeId) {
        // Implement savings calculation
    }

    async getTotalLoanBalance(employeeId) {
        // Implement loan balance calculation
    }

    async getTransactions(employeeId, startDate, endDate) {
        // Implement transaction retrieval
    }

    async getLoans(employeeId, startDate, endDate) {
        // Implement loan retrieval
    }

    async createTransaction(transactionData) {
        // Implement transaction creation
    }

    async createLoan(loanData) {
        // Implement loan creation
    }

    async verifyTransaction(reference) {
        // Implement transaction verification
    }
}

// Export the service
module.exports = new BankingService(); 