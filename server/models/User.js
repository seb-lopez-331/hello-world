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
});

// Compare password method
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
