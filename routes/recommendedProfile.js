const express = require('express');
const router = express.Router();
const recommendedProfile = require('../controllers/recommendedProfileController'); // Import the controller

router.post('/', recommendedProfile.returnRecommendedProfile);
router.post('/basicCheck', recommendedProfile.returnRecommendedProfileWithFewCriteria);
router.post('/search', recommendedProfile.searchProfiles);
router.post('/search-five', recommendedProfile.searchFiveProfiles);
router.post('/searchEngine', recommendedProfile.searchEngineForProfiles);

module.exports = router;
