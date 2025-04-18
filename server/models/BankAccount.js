const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['checking', 'savings', 'credit'], // You can customize the types
    required: true
  },
  accountNumber: {
    type: String, // Use a more secure approach for storing sensitive data in production
    required: true
  },
  accessToken: {
    type: String, // For accessing data from Plaid or other integrations
    required: true
  },
  balance: {
    type: Number, // Store the latest balance for easy access
    default: 0
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction' // Reference to transactions associated with this account
  }],
  dateConnected: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
