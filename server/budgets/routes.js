const express = require('express');
const router = express.Router();
const budgetController = require('./controller.js');
const authenticate = require('../middleware/authenticate');

// Get the user's existing budgets
router.post('/', authenticate, budgetController.connectBank);

// Get details for a specific budget
router.get('/:budgetId', authenticate, budgetController.getBankAccounts);

// Create a new budget
router.post('/', authenticate, budgetController.getAccountBalance);

// Update a budget (e.g., change the amount)
router.put('/:budgetId', authenticate, budgetController.getAccountTransactions);

// Delete a budget
router.delete('/:budgetId', authenticate, budgetController.getAccountTransactions);

module.exports = router;
