const axios = require('axios');

class ChapaPaymentService {
    constructor(secretKey) {
        this.secretKey = secretKey;
        this.baseURL = 'https://api.chapa.co/v1';
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async initiatePayment({
        amount,
        currency = 'ETB',
        email,
        first_name,
        last_name,
        tx_ref = `TX-${Date.now()}`,
        callback_url,
        return_url,
        customization = {
            title: 'Bidir Payment',
            description: 'Payment for Bidir services'
        }
    }) {
        try {
            const response = await this.client.post('/transaction/initialize', {
                amount,
                currency,
                email,
                first_name,
                last_name,
                tx_ref,
                callback_url,
                return_url,
                customization
            });
            
            return {
                checkoutUrl: response.data.data.checkout_url,
                reference: tx_ref
            };
        } catch (error) {
            console.error('Chapa payment initiation failed:', error.response?.data || error.message);
            throw new Error('Failed to initiate payment');
        }
    }

    async verifyTransaction(reference) {
        try {
            const response = await this.client.get(`/transaction/verify/${reference}`);
            return response.data.data;
        } catch (error) {
            console.error('Transaction verification failed:', error.response?.data || error.message);
            throw new Error('Failed to verify transaction');
        }
    }

    async getBanks() {
        try {
            const response = await this.client.get('/banks');
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch banks:', error.response?.data || error.message);
            throw new Error('Failed to get banks list');
        }
    }

    async initiateTransfer({
        amount,
        bank_code,
        account_number,
        account_name,
        reference = `TR-${Date.now()}`
    }) {
        try {
            const response = await this.client.post('/transfers', {
                amount,
                bank_code,
                account_number,
                account_name,
                reference
            });
            return response.data.data;
        } catch (error) {
            console.error('Transfer initiation failed:', error.response?.data || error.message);
            throw new Error('Failed to initiate transfer');
        }
    }
}

module.exports = ChapaPaymentService; 