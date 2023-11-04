const express = require('express');
const router = express.Router();
const statusUpdateController = require('../controllers/statusUpdateController');

// API endpoint for updating user status
router.post('/', statusUpdateController.updateStatus);

module.exports = router;
