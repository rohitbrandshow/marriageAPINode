
const axios = require('axios');
const AboutYourself = require('../model/aboutUser');
const User = require('../model/user');
const { userLogUrl } = require('../config');

// Controller for creating/updating "about yourself" information
const createOrUpdateAboutYourself = async (req, res) => {
  const { userId, aboutText } = req.body;

  try {
    // Validate the incoming data
    if (!userId) {
      return res.status(400).json({ status: 'false', message: 'User ID is required' });
    }

    // Check if the user exists in your database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User not found' });
    }

    // Check if a document with the specified userId exists
    let aboutYourself = await AboutYourself.findOne({ userId });

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (aboutYourself) {
      // Document with userId exists, update it
      aboutYourself.aboutText = aboutText;
      action = 'Updated';
    } else {
      // Document with userId does not exist, create a new one
      aboutYourself = new AboutYourself({ userId, aboutText });
    }

    await aboutYourself.save();

    // Log the action
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted "about yourself" info.'
        : 'User updated "about yourself" info.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `About yourself information ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

const createOrUpdateAboutYourselfFromAdmin = async (req, res) => {
  const { phone, aboutText, userUploadingBy } = req.body;

  try {
    // Validate the incoming data
    if (!phone) {
      return res.status(400).json({ status: 'false', message: 'Phone Number is required' });
    }

    // Check if the user exists in your database
    const mobile = {phone: phone };
    const user = await User.findOne(mobile);

    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User with give mobile number is not exist.' });
    }

    const query = { _id: userUploadingBy };
    query.userType = 'Admin';

    const userAdmin = await User.findOne(query);

    if (!userAdmin) {
      return res.status(200).json({
        success: false,
        message: 'Oops You are not Admin. You cannot add new users.',
      });
    }

    
    const getUserId = user.id;

    const queryUserCheck = { userId: getUserId };
    // Check if a document with the specified userId exists
    let aboutYourself = await AboutYourself.findOne(queryUserCheck);

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (aboutYourself) {
      // Document with userId exists, update it
      aboutYourself.aboutText = aboutText;
      action = 'Updated';
    } else {
      // Document with userId does not exist, create a new one
      aboutYourself = new AboutYourself({ userId: getUserId, aboutText });
    }

    await aboutYourself.save();

    // Log the action
    const userLogData = {
      userId: getUserId,
      action,
      createdBy: userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted "about yourself" info.'
        : 'User updated "about yourself" info.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `About yourself information ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

module.exports = {
  createOrUpdateAboutYourself,
  createOrUpdateAboutYourselfFromAdmin
};

