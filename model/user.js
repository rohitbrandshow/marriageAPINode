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
    gender: {
      type: String,
      enum: ['Male', 'Female'], // Use enum to specify allowed values
    },
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
    userType: {
      type: String,
      default: 'User',
    },
    createdFrom: {
      type: String,
      enum: ['adminUpload', 'webRegistrationForm'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedOn: Date,
  });
  
  userSchema.pre('save', function (next) {
    this.updatedOn = new Date();
    next();
  });

const User = mongoose.model('User', userSchema);

module.exports = User;
