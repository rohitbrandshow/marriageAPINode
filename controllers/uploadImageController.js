const Image = require('../model/imageUpload');
const multer = require('multer');
const axios = require('axios');
const { userLogUrl } = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify your destination folder here
  },
  filename: (req, file, cb) => {
    // Generate a unique filename by adding a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, uniqueSuffix + '.' + ext);
  },
});

const upload = multer({ storage });

const handleImageUpload = upload.single('image');

const uploadImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, status: 'false', message: 'User ID is important' });
    }

    const existingImage = await Image.findOne({ userId });

    if (existingImage) {
      // An image already exists for the user, update it
      const filename = req.file.filename;
      const url = `/uploads/${filename}`;

      existingImage.filename = filename;
      existingImage.url = url;
      await existingImage.save();

      // Log the action as an update
      const userLogData = {
        userId,
        action: 'Updated',
        createdBy: userId, // Replace with the actual creator ID
        changeType: 'Update',
        changes: 'User updated their image.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.status(200).json({
        success: true,
        status: 'true',
        message: 'Image updated successfully',
        userLogData,
      });
    } else {
      // No image exists for the user, insert a new one
      if (!req.file) {
        return res.status(400).json({ success: false, status: 'false', message: 'No file uploaded' });
      }

      const filename = req.file.filename;
      const url = `/uploads/${filename}`;

      const image = new Image({ userId, filename, url });
      await image.save();

      // Log the action as an insertion
      const userLogData = {
        userId,
        action: 'Inserted',
        createdBy: userId, // Replace with the actual creator ID
        changeType: 'Insert',
        changes: 'User inserted an image.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.status(201).json({
        success: true,
        status: 'true',
        message: 'Image uploaded successfully'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, status: 'false', message: 'Server error' });
  }
};

const getImage = async (req, res) => {
    try {
        const { userId } = req.body;
        const userImage = await Image.findOne({ userId });

        if (userImage) {
            // User has a profile picture
            res.status(200).json({
            success: true,
            status: 'true',
            imageUrl: userImage.url,
            });
        } else {
            // User does not have a profile picture
            res.status(200).json({
            success: false,
            status: 'false',
            message: 'User does not have a profile picture',
            imageUrl: '',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            status: 'false',
            message: 'Server error',
        });
    }
}

module.exports = { handleImageUpload, uploadImage, getImage };
