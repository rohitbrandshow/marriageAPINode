const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
      type: String,
      unique: true, // Make email field unique
    },
    phone: {
      type: String,
      unique: true, // Make phone field unique
    },
    dob: Date,
    gender: String,
    password: String,
    status: {
      type: String,
      default: 'inactive',
    },
    verificationCode: String,
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  });
  

const User = mongoose.model('User', userSchema);

module.exports = User;
