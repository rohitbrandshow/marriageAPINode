const express = require('express');
const router = express.Router();
const basicInfoController = require('../controllers/basicInfoController');

// Define the route for creating/updating basic information
router.post('/', basicInfoController.createOrUpdateBasicInfo);
router.post('/userBasicInformationUpdateByAdmin', basicInfoController.createOrUpdateBasicInfoFromAdmin);

module.exports = router;

