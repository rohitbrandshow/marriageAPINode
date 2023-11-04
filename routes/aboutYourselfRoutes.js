const express = require('express');
const router = express.Router();
const aboutYourselfController = require('../controllers/aboutYourselfController');

// Define the route for creating/updating "about yourself" information
router.post('/', aboutYourselfController.createOrUpdateAboutYourself);
router.post('/updateAboutFromAdmin', aboutYourselfController.createOrUpdateAboutYourselfFromAdmin);

module.exports = router;
