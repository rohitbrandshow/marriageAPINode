// routes/registration.js
const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/registrationController'); // Import the controller

router.post('/', RegistrationController.userRegistration);
router.post('/userAddFromAdmin', RegistrationController.userAddFromAdmin);
router.post('/forgetPassword', RegistrationController.forgetPassword);

module.exports = router;
