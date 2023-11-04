const express = require('express');
const router = express.Router();
const religiousBackgroundController = require('../controllers/religiousBackgroundController');

// Define the route for creating/updating basic information
router.post('/', religiousBackgroundController.createOrUpdateReligiousBackground);
router.post('/userReligiousBackgroundInformationUpdateByAdmin', religiousBackgroundController.createOrUpdateReligiousBackgroundFromAdmin);

module.exports = router;
