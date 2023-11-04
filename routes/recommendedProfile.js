const express = require('express');
const router = express.Router();
const recommendedProfile = require('../controllers/recommendedProfileController'); // Import the controller

router.post('/', recommendedProfile.returnRecommendedProfile);

module.exports = router;
