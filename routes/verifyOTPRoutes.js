const express = require('express');
const router = express.Router();
const verifyOTPController = require('../controllers/verifyOTPController');

// Define the route for OTP verification
router.post('/', verifyOTPController.verifyOTP);

module.exports = router;
