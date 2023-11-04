// routes/registration.js
const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/registrationController'); // Import the controller

router.post('/', RegistrationController.userRegistration);
router.post('/userAddFromAdmin', RegistrationController.userAddFromAdmin);

module.exports = router;
