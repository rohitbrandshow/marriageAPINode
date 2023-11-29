const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateAndTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model if notifications are associated with users
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model if notifications are associated with users
  },
  addedOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedOn: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // You can customize the status options based on your requirements
    default: 'active',
    required: true,
  },
  featuredStatus: {
    type: Boolean,
  }
});
const Notification = mongoose.model('Notification', notificationSchema);


const articleSchema = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      unique: true,
      required: true,
    },
    metaDescription: {
      type: String,
      unique: true,
      required: true,
    },
    metaKeywords: {
      type: String,
      unique: true,
      required: true,
    },
    addedOn: {
      type: Date,
      default: Date.now,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    updatedOn: {
      type: Date,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
    url: {
      type: String,
      unique: true,
      required: true,
    },
    featuredStatus: {
      type: Boolean,
    }
  });
  
  const Article = mongoose.model('Article', articleSchema);

module.exports = {
    Notification,
    Article
};