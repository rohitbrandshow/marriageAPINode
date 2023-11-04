const express = require('express');
const router = express.Router();
const verifyMailOTPController = require('../controllers/verifyMailOTPController');

// Define the route for OTP verification
router.post('/', verifyMailOTPController.verifyEmailOTP);

module.exports = router;
