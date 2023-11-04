// familyController.js
const axios = require('axios');
const FamilyInfo = require('../model/familyInfo');
const User = require('../model/user');
const { userLogUrl } = require('../config');

// Controller for creating/updating family information
const createOrUpdateFamilyInfo = async (req, res) => {
  const {
    userId,
    fatherStatus,
    motherStatus,
    familyLocation,
    nativePlace,
    siblings, // An object containing sibling details
    familyType,
    familyValues,
    familyAffluence,
    // Additional fields as needed
  } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ status: 'false', message: 'User ID is required' });
    }

    // Check if the user exists in your database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User not found' });
    }

    let familyInfo = await FamilyInfo.findOne({ userId });

    if (!familyInfo) {
      familyInfo = new FamilyInfo({ userId });
    }

    const updatedFields = {}; // Store updated fields for logging
    let action = 'Inserted'; // Initialize the action as "Inserted"

    // Check if any data fields were provided in the request
    const hasDataToUpdate =
      fatherStatus || motherStatus || familyLocation || nativePlace || siblings ||
      familyType || familyValues || familyAffluence;

    if (hasDataToUpdate) {
      // Update family-related information if provided in the request
      if (fatherStatus) {
        familyInfo.fatherStatus = fatherStatus;
        updatedFields.fatherStatus = fatherStatus;
      }
      if (motherStatus) {
        familyInfo.motherStatus = motherStatus;
        updatedFields.motherStatus = motherStatus;
      }
      if (familyLocation) {
        familyInfo.familyLocation = familyLocation;
        updatedFields.familyLocation = familyLocation;
      }
      if (nativePlace) {
        familyInfo.nativePlace = nativePlace;
        updatedFields.nativePlace = nativePlace;
      }
      if (siblings) {
        familyInfo.siblings = {
          numberOfSiblings: siblings.numberOfSiblings,
          notMarried: siblings.notMarried,
          married: siblings.married,
        };
        updatedFields.siblings = siblings;
      }
      if (familyType) {
        familyInfo.familyType = familyType;
        updatedFields.familyType = familyType;
      }
      if (familyValues) {
        familyInfo.familyValues = familyValues;
        updatedFields.familyValues = familyValues;
      }
      if (familyAffluence) {
        familyInfo.familyAffluence = familyAffluence;
        updatedFields.familyAffluence = familyAffluence;
      }

      // Additional fields can be updated similarly.

      // If any fields were updated, change the action to "Updated"
      action = 'Updated';
    }

    await familyInfo.save();

    // Log the action as an insertion/update
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? `User inserted family info: ${JSON.stringify(updatedFields)}`
        : `User updated family info: ${JSON.stringify(updatedFields)}`,
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    const message = action === 'Inserted'
      ? 'Family information inserted successfully'
      : 'Family information updated successfully';

    return res.json({ status: 'true', message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
};
const createOrUpdateFamilyInfoFromAdmin = async (req, res) => {
  const {
    // userId,
    phone,
    fatherStatus,
    motherStatus,
    familyLocation,
    nativePlace,
    siblings, // An object containing sibling details
    familyType,
    familyValues,
    familyAffluence,
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

    let familyInfo = await FamilyInfo.findOne({ userId: getUserId });

    if (!familyInfo) {
      familyInfo = new FamilyInfo({ userId: getUserId});
    }

    const updatedFields = {}; // Store updated fields for logging
    let action = 'Inserted'; // Initialize the action as "Inserted"

    // Check if any data fields were provided in the request
    const hasDataToUpdate =
      fatherStatus || motherStatus || familyLocation || nativePlace || siblings ||
      familyType || familyValues || familyAffluence;

    if (hasDataToUpdate) {
      // Update family-related information if provided in the request
      if (fatherStatus) {
        familyInfo.fatherStatus = fatherStatus;
        updatedFields.fatherStatus = fatherStatus;
      }
      if (motherStatus) {
        familyInfo.motherStatus = motherStatus;
        updatedFields.motherStatus = motherStatus;
      }
      if (familyLocation) {
        familyInfo.familyLocation = familyLocation;
        updatedFields.familyLocation = familyLocation;
      }
      if (nativePlace) {
        familyInfo.nativePlace = nativePlace;
        updatedFields.nativePlace = nativePlace;
      }
      if (siblings) {
        familyInfo.siblings = {
          numberOfSiblings: siblings.numberOfSiblings,
          notMarried: siblings.notMarried,
          married: siblings.married,
        };
        updatedFields.siblings = siblings;
      }
      if (familyType) {
        familyInfo.familyType = familyType;
        updatedFields.familyType = familyType;
      }
      if (familyValues) {
        familyInfo.familyValues = familyValues;
        updatedFields.familyValues = familyValues;
      }
      if (familyAffluence) {
        familyInfo.familyAffluence = familyAffluence;
        updatedFields.familyAffluence = familyAffluence;
      }

      // Additional fields can be updated similarly.

      // If any fields were updated, change the action to "Updated"
      action = 'Updated';
    }

    await familyInfo.save();

    // Log the action as an insertion/update
    const userLogData = {
      userId: getUserId,
      action,
      createdBy:userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? `User inserted family info: ${JSON.stringify(updatedFields)}`
        : `User updated family info: ${JSON.stringify(updatedFields)}`,
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    const message = action === 'Inserted'
      ? 'Family information inserted successfully'
      : 'Family information updated successfully';

    return res.json({ status: 'true', message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
};

module.exports = {
  createOrUpdateFamilyInfo,
  createOrUpdateFamilyInfoFromAdmin
};
