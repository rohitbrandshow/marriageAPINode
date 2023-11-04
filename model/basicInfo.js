const mongoose = require('mongoose');

const basicInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Make userId unique
  },
  profileCreatedBy: {
    type: String, // Self or other options
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  placeOfBirth: {
    type: String,
  },
  maritalStatus: {
    type: String, // Marital status options, e.g., "Never Married," "Married," "Divorced," etc.
  },
  height: {
    type: String, // Height range or specific height
  },
  skinColor: {
    type: String, // Height range or specific height
  },
  healthInformation: {
    disability: {
      type: String, // Disability information
    },
    bloodGroup: {
      type: String, // Blood group information
    },
  },
  // Additional fields or parameters can be added as needed.
});

const BasicInfo = mongoose.model('BasicInfo', basicInfoSchema);

module.exports = BasicInfo;
