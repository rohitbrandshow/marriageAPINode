const mongoose = require('mongoose');

const aboutYourselfSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  aboutText: {
    type: String,
  },
  __v: {
    type: Number,
    select: false, // This is used to hide __v in the response
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AboutYourself = mongoose.model('AboutYourself', aboutYourselfSchema);

module.exports = AboutYourself;
