const mongoose = require('mongoose');

const religiousBackgroundSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    unique: true, // Each user can have only one religious background entry
  },
  religion: {
    type: String,
    required: false, // You can set it to true if religion is required
  },
  motherTongue: {
    type: String,
    required: false, // You can set it to true if mother tongue is required
  },
  community: {
    type: String,
    required: false, // You can set it to true if community is required
  },
  subCommunity: {
    type: String,
    required: false, // You can set it to true if sub-community is required
  },
  gothra: {
    type: String,
    required: false, // You can set it to true if gothra is required
  },
});

module.exports = mongoose.model('ReligiousBackground', religiousBackgroundSchema);
