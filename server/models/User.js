const BankAccount = require('./BankAccount');
const Alert = require('./Alert');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String,
    required: true,
  }, // hashed
  username: {
    type: String,
    required: true,
  },
  preferences: {
    type: Map,
    of: String, // Example: { theme: 'dark', currency: 'USD' }
    default: {}
  },
  connectedAccounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BankAccount' // Assuming you have a BankAccount model
  }],
  alerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert' // Assuming you have an Alert model
  }],
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

// Compare password method
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
