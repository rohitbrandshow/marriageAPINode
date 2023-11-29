// In userRoutes.js
const express = require('express');
const router = express.Router();
const controllerData = require('../controllers/userCountController');

router.get('/profile', controllerData.getUsersCount);

module.exports = router;
