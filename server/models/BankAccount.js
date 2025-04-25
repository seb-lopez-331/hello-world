const mongoose = require('mongoose');

const linksSchema = new mongoose.Schema({
  balances: {
    type: String,
    required: true,
  },
  self: {
    type: String,
    required: true,
  },
  transactions: {
    type: String,
    required: true,
  },
});

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const bankAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  accessToken: {
    type: String, // For accessing data from Plaid or other integrations
    required: true,
  },
  enrollmentId: {
    type: String,
    required: true,
  },
  links: {
    type: linksSchema,
    required: true,
  },
  institution: {
    type: institutionSchema,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  subtype: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 0
  },
  id: {
    type: String,
    required: true
  },
  lastFour: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
});

// Prevent duplicate bank accounts
bankAccountSchema.index({
  'institution.name': 1,
  type: 1,
  name: 1,
  subtype: 1,
  currency: 1,
  lastFour: 1,
  userId: 1,
}, {unique: true});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
