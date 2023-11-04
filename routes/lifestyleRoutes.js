const express = require('express');
const router = express.Router();
const lifestyleController = require('../controllers/lifestyleController');

// Define the route for creating/updating lifestyle information
router.post('/', lifestyleController.createOrUpdateLifestyleInfo);
router.post('/userLifestyleInformationUpdateByAdmin', lifestyleController.createOrUpdateLifestyleInfoFromAdmin);

module.exports = router;
