const axios = require('axios');
const BasicInfo = require('../model/basicInfo');
const User = require('../model/user');
const { userLogUrl } = require('../config');

// Controller for creating/updating basic information
const createOrUpdateBasicInfo = async (req, res) => {
  const {
    userId,
    profileCreatedBy,
    dateOfBirth,
    placeOfBirth,
    maritalStatus,
    height,
    skinColor,
    healthInformation,
    // Additional fields as needed
  } = req.body;

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

    let basicInfo = await BasicInfo.findOne({ userId });

    if (!basicInfo) {
      basicInfo = new BasicInfo({ userId });
    }

    const updatedFields = {}; // Store updated fields for logging
    let action = 'Inserted'; // Initialize the action as "Inserted"

    // Update basic information if provided in the request
    if (dateOfBirth) {
      basicInfo.dateOfBirth = new Date(dateOfBirth);
      updatedFields.dateOfBirth = new Date(dateOfBirth);
      action = 'Updated'; // If dateOfBirth is provided, change the action to "Updated"
    }
    if (placeOfBirth) {
      basicInfo.placeOfBirth = placeOfBirth;
      updatedFields.placeOfBirth = placeOfBirth;
      action = 'Updated'; // If placeOfBirth is provided, change the action to "Updated"
    }
    if (profileCreatedBy) {
      basicInfo.profileCreatedBy = profileCreatedBy;
      updatedFields.profileCreatedBy = profileCreatedBy;
      action = 'Updated'; // If profileCreatedBy is provided, change the action to "Updated"
    }
    if (maritalStatus) {
      basicInfo.maritalStatus = maritalStatus;
      updatedFields.maritalStatus = maritalStatus;
      action = 'Updated'; // If maritalStatus is provided, change the action to "Updated"
    }
    if (height) {
      basicInfo.height = height;
      updatedFields.height = height;
      action = 'Updated'; // If height is provided, change the action to "Updated"
    }
    if (skinColor) {
      basicInfo.skinColor = skinColor;
      updatedFields.skinColor = skinColor;
      action = 'Updated'; // If skinColor is provided, change the action to "Updated"
    }
    if (healthInformation) {
      if (healthInformation.disability) {
        basicInfo.healthInformation.disability = healthInformation.disability;
        updatedFields['healthInformation.disability'] = healthInformation.disability;
        action = 'Updated'; // If disability is provided, change the action to "Updated"
      }
      if (healthInformation.bloodGroup) {
        basicInfo.healthInformation.bloodGroup = healthInformation.bloodGroup;
        updatedFields['healthInformation.bloodGroup'] = healthInformation.bloodGroup;
        action = 'Updated'; // If bloodGroup is provided, change the action to "Updated"
      }
    }

    // Update additional fields as needed.

    await basicInfo.save();

    // Log the action as an insertion/update
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? `User inserted basic info: ${JSON.stringify(updatedFields)}`
        : `User updated basic info: ${JSON.stringify(updatedFields)}`,
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    const message = action === 'Inserted'
      ? 'Basic information inserted successfully'
      : 'Basic information updated successfully';

    return res.json({ status: 'true', message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
};


// Updated or insert data from admin user
const createOrUpdateBasicInfoFromAdmin = async (req, res) => {
  const {
    phone,
    profileCreatedBy,
    dateOfBirth,
    placeOfBirth,
    maritalStatus,
    height,
    skinColor,
    healthInformation,
    userUploadingBy
    // Additional fields as needed
  } = req.body;

  try {
 
    if (!phone) {
      return res.status(400).json({ status: 'false', message: 'Phone Number is required' });
    }
    
    // Check if the user exists in your database
    const mobile = {phone: phone };
    const user = await User.findOne(mobile);

    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User with give mobile number is not exist.' });
    }

    const query = { _id: userUploadingBy};
    query.userType = 'Admin';

    const userAdmin = await User.findOne(query);

    if (!userAdmin) {
      return res.status(200).json({
        success: false,
        message: 'Oops You are not Admin. You cannot add new users.',
      });
    }
    const getUserId = user.id;

    let basicInfo = await BasicInfo.findOne({userId: getUserId});

    if (!basicInfo) {
      basicInfo = new BasicInfo({userId: getUserId });
    }

    const updatedFields = {}; // Store updated fields for logging
    let action = 'Inserted'; // Initialize the action as "Inserted"

    // Update basic information if provided in the request
    if (dateOfBirth) {
      basicInfo.dateOfBirth = new Date(dateOfBirth);
      updatedFields.dateOfBirth = new Date(dateOfBirth);
      action = 'Updated'; // If dateOfBirth is provided, change the action to "Updated"
    }
    if (placeOfBirth) {
      basicInfo.placeOfBirth = placeOfBirth;
      updatedFields.placeOfBirth = placeOfBirth;
      action = 'Updated'; // If placeOfBirth is provided, change the action to "Updated"
    }
    if (profileCreatedBy) {
      basicInfo.profileCreatedBy = profileCreatedBy;
      updatedFields.profileCreatedBy = profileCreatedBy;
      action = 'Updated'; // If profileCreatedBy is provided, change the action to "Updated"
    }
    if (maritalStatus) {
      basicInfo.maritalStatus = maritalStatus;
      updatedFields.maritalStatus = maritalStatus;
      action = 'Updated'; // If maritalStatus is provided, change the action to "Updated"
    }
    if (height) {
      basicInfo.height = height;
      updatedFields.height = height;
      action = 'Updated'; // If height is provided, change the action to "Updated"
    }
    if (skinColor) {
      basicInfo.skinColor = skinColor;
      updatedFields.skinColor = skinColor;
      action = 'Updated'; // If skinColor is provided, change the action to "Updated"
    }
    if (healthInformation) {
      if (healthInformation.disability) {
        basicInfo.healthInformation.disability = healthInformation.disability;
        updatedFields['healthInformation.disability'] = healthInformation.disability;
        action = 'Updated'; // If disability is provided, change the action to "Updated"
      }
      if (healthInformation.bloodGroup) {
        basicInfo.healthInformation.bloodGroup = healthInformation.bloodGroup;
        updatedFields['healthInformation.bloodGroup'] = healthInformation.bloodGroup;
        action = 'Updated'; // If bloodGroup is provided, change the action to "Updated"
      }
    }

    // Update additional fields as needed.

    await basicInfo.save();

    // Log the action as an insertion/update
    const userLogData = {
      userId: getUserId,
      action,
      createdBy:userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? `User inserted basic info: ${JSON.stringify(updatedFields)}`
        : `User updated basic info: ${JSON.stringify(updatedFields)}`,
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    const message = action === 'Inserted'
      ? 'Basic information inserted successfully'
      : 'Basic information updated successfully';

    return res.json({ status: 'true', message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
};

module.exports = {
  createOrUpdateBasicInfo,
  createOrUpdateBasicInfoFromAdmin
};
