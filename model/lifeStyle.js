const mongoose = require('mongoose');

const lifestyleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Make userId unique
  },
  diet: {
    type: String, // Dietary preference, e.g., "Veg," "Non-Veg," "Occasionally Non-Veg," "Eggetarian," "Jain," "Vegan."
  },
  // Additional lifestyle-related parameters can be added as needed.
});

const LifestyleInfo = mongoose.model('LifestyleInfo', lifestyleSchema);

module.exports = LifestyleInfo;
