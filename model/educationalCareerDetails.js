const mongoose = require('mongoose');

const educationCareerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Make userId unique
  },
  highestQualification: {
    type: String, // Highest qualification, e.g., "BCA."
  },
  collegesAttended: [
    {
      collegeName: {
        type: String, // College or university name.
      },
    },
  ],
  workingStatus: {
    type: String, // Working status, e.g., "Working," "Not Working."
  },
  jobDetails: {
    jobTitle: {
      type: String, // Job title, e.g., "Software Developer / Programmer."
    },
    employerName: {
      type: String, // Employer's name.
    },
    annualIncome: {
      type: String, // Annual income, e.g., "INR 7 Lakh to 10 Lakh."
    },
    isIncomePrivate: {
      type: Boolean, // To indicate if the income should be kept private.
    },
  },
  // Additional education and career-related parameters can be added as needed.
});

const EducationCareerInfo = mongoose.model('EducationCareerInfo', educationCareerSchema);

module.exports = EducationCareerInfo;
