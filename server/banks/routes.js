const express = require('express');
const router = express.Router();
const bankController = require('./controller.js');

// Create a new link token
router.post('/create-link-token', bankController.createLinkToken);

// Connect a new bank account
router.post('/connect', bankController.connectBank);

// Get list of connected accounts
router.get('/', bankController.getBankAccounts);

// Disconnect a bank account
router.delete('/:accountId', bankController.disconnectBank);

// Get balance for specific account
router.get('/:accountId/balance', bankController.getAccountBalance);

// Get transactions for specific account
router.get('/:accountId/transactions', bankController.getAccountTransactions);

module.exports = router;
