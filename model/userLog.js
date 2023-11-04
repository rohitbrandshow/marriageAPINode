const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeType: {
      type: String, // "Insert" or "Update"
    },
    changes: {
      type: String, // Details about the changes made
    },
    // Additional fields can be added as needed.
  });

const UserLog = mongoose.model('UserLog', userLogSchema);

module.exports = UserLog;
