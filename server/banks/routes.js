const express = require('express');
const router = express.Router();
const bankController = require('./controller.js');
const authenticate = require('../middleware/authenticate');

// Connect a new bank account
router.post('/connect', authenticate, bankController.connectBank);

// Get list of connected accounts
router.get('/', authenticate, bankController.getBankAccounts);

// Disconnect a bank account
router.delete('/:accountId', authenticate, bankController.disconnectBank);

// Get balance for specific account
router.get('/:accountId/balance', authenticate, bankController.getAccountBalance);

// Get transactions for specific account
router.get('/:accountId/transactions', authenticate, bankController.getAccountTransactions);

module.exports = router;
