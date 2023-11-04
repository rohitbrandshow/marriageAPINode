// routes/userLog.js
const express = require('express');
const router = express.Router();
const User = require('../model/user'); // Import your User model from the appropriate path
const UserLog = require('../model/userLog'); // Import your UserLog model

// API endpoint for creating user logs
router.post('/', async (req, res) => {
  const { userId, action, createdBy, changeType, changes } = req.body;

  try {
    // Validate the incoming data
    if (!userId || !action || !createdBy || !changeType) {
      return res.status(400).json({ status: 'false', message: 'Missing required fields' });
    }

    // Check if the user exists in your database
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ status: 'false', message: 'User not found' });
    }

    const userLog = new UserLog({
      userId,
      action,
      createdBy,
      changeType,
      changes, // Capture the details of the changes made
    });

    await userLog.save();

    return res.status(201).json({ status: 'true', message: 'User log entry created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
});

module.exports = router;
