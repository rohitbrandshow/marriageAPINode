const express = require('express');
const router = express.Router();
const preferences = require('../controllers/preferences'); // Import the controller

router.post('/basic', preferences.createOrUpdateBasicDetailsPreference);
router.post('/community', preferences.createOrUpdateCommunityPreferences);
router.post('/location', preferences.createOrUpdateLocationPreferences);
router.post('/career-and-edu', preferences.createOrUpdateEducationCareerPreferences);
router.post('/extra-details', preferences.createOrUpdateOtherPreferences);

router.post('/info/basic', preferences.returnBasicPreference);
router.post('/info/community', preferences.returnCommunityPreference);
router.post('/info/edu-career', preferences.returnCareerAndEducationPreference);
router.post('/info/location', preferences.returnLocationPreference);
router.post('/info/other', preferences.returnOtherPreference);

//added by Admin
router.post('/updateBasicPreferenceFromAdmin', preferences.createOrUpdateBasicDetailsPreferenceFromAdmin);
router.post('/updateCommunityPreferenceFromAdmin', preferences.createOrUpdateCommunityPreferencesFromAdmin);
router.post('/updateLocationPreferenceFromAdmin', preferences.createOrUpdateLocationPreferencesFromAdmin);
router.post('/updateEducationCareerPreferenceFromAdmin', preferences.createOrUpdateEducationCareerPreferencesFromAdmin);
router.post('/updateOtherPreferenceFromAdmin', preferences.createOrUpdateOtherPreferencesFromAdmin);

module.exports = router;
