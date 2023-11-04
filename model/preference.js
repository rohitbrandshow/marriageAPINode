const mongoose = require('mongoose');

// Define the schema for BasicDetailsPreference
const basicDetailsPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  ageRange: {
    min: Number,
    max: Number,
  },
  heightRange: {
    min: Number,
    max: Number,
  },
  maritalStatus: {
    openToAll: Boolean,
    other: [String],
  },
});



// Create the BasicDetailsPreference model
const BasicDetailsPreference = mongoose.model('BasicDetailsPreference', basicDetailsPreferenceSchema);

const communityPreferencesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  religions: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  communities: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  motherTongues: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  gothra: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    dontIncludeMyGothra: {
      type: Boolean,
      default: false,
    },
  },
});

// Create the CommunityPreferences model
const CommunityPreferences = mongoose.model('CommunityPreferences', communityPreferencesSchema);

const locationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Each user can have only one set of location preferences
  },
  locations: [
    {
      type: String, // Location (e.g., City, State, Country, etc.)
    },
  ],
});
const locationPreference = mongoose.model('locationPreference', locationPreferenceSchema);

const educationCareerPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Each user can have only one set of education and career preferences
  },
  qualifications: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  workingWith: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  professions: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  annualIncome: {
    openToAll: Boolean,
    currency: String,
    incomeFrom: String,
    incomeTo: String,
    showBothHiddenAndMatchSetIncomeRange: Boolean, // Add this field
  },
});

const educationCareerPreference = mongoose.model('educationCareerPreference', educationCareerPreferenceSchema);

const otherPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Each user can have only one set of other preferences
  },
  profileCreatedBy: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
  diet: {
    openToAll: {
      type: Boolean,
      default: false,
    },
    other: {
      type: [String],
      default: [],
    },
  },
});

const OtherPreferences = mongoose.model('OtherPreferences', otherPreferencesSchema);

module.exports = {
  BasicDetailsPreference,
  CommunityPreferences,
  locationPreference,
  educationCareerPreference,
  OtherPreferences
};
