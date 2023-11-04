const mongoose = require('mongoose');

const familyInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Make userId unique
  },
  fatherStatus: {
    type: String, // Father's status (e.g., "Working," "Retired," "Deceased," etc.).
  },
  motherStatus: {
    type: String, // Mother's status (e.g., "Housewife," "Working," "Deceased," etc.).
  },
  familyLocation: {
    type: String, // Family location (e.g., "Delhi, India").
  },
  nativePlace: {
    type: String, // User's native place.
  },
  siblings: {
    numberOfSiblings: {
      type: Number, // Number of siblings.
    },
    notMarried: {
      type: Number, // Number of unmarried siblings.
    },
    married: {
      type: Number, // Number of married siblings.
    },
  },
  familyType: {
    type: String, // Family type (e.g., "Joint," "Nuclear").
  },
  familyValues: {
    type: String, // Family values (e.g., "Traditional," "Moderate," "Liberal").
  },
  familyAffluence: {
    type: String, // Family affluence (e.g., "High," "Moderate," "Low").
  },
  // Additional family-related parameters can be added as needed.
});

const FamilyInfo = mongoose.model('FamilyInfo', familyInfoSchema);

module.exports = FamilyInfo;
