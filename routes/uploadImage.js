const express = require('express');
const router = express.Router();
const { handleImageUpload, uploadImage, getImage } = require('../controllers/uploadImageController');

// Route for handling image upload
router.post('/profilePic', handleImageUpload, uploadImage);
router.post('/getPic', getImage);

module.exports = router;
