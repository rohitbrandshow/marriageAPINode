// educationCareerRoutes.js
const express = require('express');
const router = express.Router();
const educationCareerController = require('../controllers/educationCareerController');

// Define the route for creating/updating education and career information
router.post('/', educationCareerController.createOrUpdateEducationCareerInfo);
router.post('/userEducationCareerUpdateByAdmin', educationCareerController.createOrUpdateEducationCareerInfoFromAdmin);

module.exports = router;
