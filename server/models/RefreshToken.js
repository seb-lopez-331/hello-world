// models/RefreshToken.js
const mongoose = require('mongoose');

// Schema for storing refresh tokens
const refreshTokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
}, { timestamps: true });

// Create an index to expire refresh tokens automatically
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;