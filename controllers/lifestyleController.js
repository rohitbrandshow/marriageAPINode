const axios = require('axios');
const User = require('../model/user');
const LifestyleInfo = require('../model/lifeStyle');

const { userLogUrl } = require('../config');

// Controller for creating/updating lifestyle information
const createOrUpdateLifestyleInfo = async (req, res) => {
  const { userId, diet } = req.body;
  let userLogData = null;

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

    // Retrieve the existing lifestyle information
    let lifestyleInfo = await LifestyleInfo.findOne({ userId });

    // If no existing record, create a new one
    if (!lifestyleInfo) {
      lifestyleInfo = new LifestyleInfo({ userId });
      lifestyleInfo.diet = diet; // Set dietary preference
      await lifestyleInfo.save();

      // Log the action as an insertion
      userLogData = {
        userId,
        action: 'Inserted',
        createdBy: userId, // Replace with the actual creator ID
        changeType: 'Insert',
        changes: 'User inserted lifestyle info.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.status(201).json({
        status: 'true',
        message: 'Lifestyle information inserted successfully',
        userLogData, // Include userLogData in the response
      });
    } else {
      // Lifestyle info already exists, update it
      if (diet) {
        lifestyleInfo.diet = diet; // Update dietary preference
        await lifestyleInfo.save();

        // Log the action as an update
        userLogData = {
          userId,
          action: 'Updated',
          createdBy: userId, // Replace with the actual creator ID
          changeType: 'Update',
          changes: `User updated lifestyle info: Dietary preference set to "${diet}".`,
        };

        // Send a POST request to the user-log API
        await axios.post(userLogUrl, userLogData);

        return res.status(200).json({
          status: 'true',
          message: 'Lifestyle information updated successfully',
          userLogData, // Include userLogData in the response
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};
const createOrUpdateLifestyleInfoFromAdmin = async (req, res) => {
  const { diet, phone,userUploadingBy } = req.body;
  let userLogData = null;

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

    // Retrieve the existing lifestyle information
    let lifestyleInfo = await LifestyleInfo.findOne({ userId:getUserId });

    // If no existing record, create a new one
    if (!lifestyleInfo) {
      lifestyleInfo = new LifestyleInfo({ userId:getUserId });
      lifestyleInfo.diet = diet; // Set dietary preference
      await lifestyleInfo.save();

      // Log the action as an insertion
      userLogData = {
        userId:getUserId,
        action: 'Inserted',
        createdBy:userUploadingBy, // Replace with the actual creator ID
        changeType: 'Insert',
        changes: 'User inserted lifestyle info.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.status(201).json({
        status: 'true',
        message: 'Lifestyle information inserted successfully',
        userLogData, // Include userLogData in the response
      });
    } else {
      // Lifestyle info already exists, update it
      if (diet) {
        lifestyleInfo.diet = diet; // Update dietary preference
        await lifestyleInfo.save();

        // Log the action as an update
        userLogData = {
          userId:getUserId,
          action: 'Updated',
          createdBy: userUploadingBy, // Replace with the actual creator ID
          changeType: 'Update',
          changes: `User updated lifestyle info: Dietary preference set to "${diet}".`,
        };

        // Send a POST request to the user-log API
        await axios.post(userLogUrl, userLogData);

        return res.status(200).json({
          status: 'true',
          message: 'Lifestyle information updated successfully',
          userLogData, // Include userLogData in the response
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

module.exports = {
  createOrUpdateLifestyleInfo,
  createOrUpdateLifestyleInfoFromAdmin
};
