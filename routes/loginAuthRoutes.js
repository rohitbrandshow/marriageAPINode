const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginAuthController'); // Import the controller

// API endpoint for email login
router.post('/', loginController.login);
router.post('/returnLogin', loginController.loginReturn);

module.exports = router;
