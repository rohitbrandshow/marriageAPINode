const express = require('express');
const router = express.Router();
const sendMobOTPController = require('../controllers/sendMobOTPController');

// Define the route for sending mobile OTP
router.post('/', sendMobOTPController.createOrUpdateSendMobOTP);

module.exports = router;