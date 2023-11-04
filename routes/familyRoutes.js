// familyRoutes.js
const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

// Define the route for creating/updating family information
router.post('/', familyController.createOrUpdateFamilyInfo);
router.post('/userFamilyInformationUpdateByAdmin', familyController.createOrUpdateFamilyInfoFromAdmin);

module.exports = router;
