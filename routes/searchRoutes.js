const express = require('express');
const router = express.Router();
const searchData = require('../controllers/searchController');

// Define the route for creating/updating basic information
router.post('/oppositeGender', searchData.returnOppositeGender);

module.exports = router;
