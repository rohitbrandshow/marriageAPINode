const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginViaMobController'); // Import the controller

// API endpoint for mobile login
router.post('/', loginController.loginViaMobile);

module.exports = router;
