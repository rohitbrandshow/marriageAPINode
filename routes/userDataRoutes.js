const express = require('express');
const router = express.Router();
const userData = require('../controllers/userDataController'); // Import the controller

router.post('/basic', userData.returnUserDataFromUserTable);
router.post('/about', userData.returnUserAboutDataFromAboutTable);
router.post('/basic-info', userData.returnUserBasicInfoFromBasicInfoTable);
router.post('/religious-info', userData.returnUserReligiousInfo);
router.post('/family-info', userData.returnFamilyInfo);
router.post('/edu-career-info', userData.returnEducationAndCareerInfo);
router.post('/lifestyle', userData.returnLifeStyleInfo);
router.post('/user-id-from-mob', userData.returnUserDataFromNumber);
router.post('/user-data-from-id', userData.returnUserDataFromUserTableUsingUserId);
router.post('/user-basic-data-from-id', userData.returnUserBasicInfoFromBasicInfoTableUsingUserID);
router.post('/matchProfiles', userData.returnMatchValue);

module.exports = router;
