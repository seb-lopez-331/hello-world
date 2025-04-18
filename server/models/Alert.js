const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alertType: {
    type: String,
    enum: ['spending', 'balance', 'budget'], // Example: Spending alerts, balance alerts, etc.
    required: true
  },
  threshold: {
    type: Number, // The value that triggers the alert
    required: true
  },
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'], // When to trigger the alert
    required: true
  },
  isActive: {
    type: Boolean,
    default: true // To allow users to deactivate alerts
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);
