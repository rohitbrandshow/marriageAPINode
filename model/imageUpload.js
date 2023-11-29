const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: String, // You might need to adjust the data type
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
