// API Routes for Banking Operations
const express = require('express');
const router = express.Router();
const bankingService = require('./banking');
const auth = require('../middleware/auth');

// Savings Routes
router.post('/savings/deduct', auth, async (req, res) => {
    try {
        const { salary } = req.body;
        const transaction = await bankingService.processSavingsDeduction(
            req.user.id,
            salary
        );
        res.json({ success: true, transaction });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Loan Routes
router.post('/loans/apply', auth, async (req, res) => {
    try {
        const { amount, term } = req.body;
        const loan = await bankingService.processLoanApplication(
            req.user.id,
            amount,
            term
        );
        res.json({ success: true, loan });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Withdrawal Routes
router.post('/withdraw', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const withdrawal = await bankingService.processWithdrawal(
            req.user.id,
            amount
        );
        res.json({ success: true, withdrawal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Statement Routes
router.get('/statements', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const statement = await bankingService.generateStatement(
            req.user.id,
            new Date(startDate),
            new Date(endDate)
        );
        res.json({ success: true, statement });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Balance Routes
router.get('/balance', auth, async (req, res) => {
    try {
        const balance = await bankingService.getAccountBalance(req.user.id);
        res.json({ success: true, balance });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Transaction Verification Webhook
router.post('/transactions/verify', async (req, res) => {
    try {
        const { reference } = req.body;
        await bankingService.verifyTransaction(reference);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Interest Calculation (Admin Only)
router.post('/interest/calculate', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            throw new Error('Unauthorized access');
        }
        const { employeeId } = req.body;
        const interest = await bankingService.calculateSavingsInterest(employeeId);
        res.json({ success: true, interest });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router; 