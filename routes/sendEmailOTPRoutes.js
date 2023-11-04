const express = require('express');
const router = express.Router();
const { sendEmailOTP } = require('../controllers/sendEmailOTPController'); // Import your controller

// Define the route for sending email OTP
router.post('/', sendEmailOTP);

module.exports = router;
