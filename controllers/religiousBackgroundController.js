const axios = require('axios');
const User = require('../model/user');
const ReligiousBackground = require('../model/religiousBackground'); // Assuming you have a model for religious background

const { userLogUrl } = require('../config');

// Controller for creating/updating religious background information
const createOrUpdateReligiousBackground = async (req, res) => {
  const { userId, religion, motherTongue, community, subCommunity, gothra } = req.body;
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

    // Retrieve the existing religious background information
    let religiousBackground = await ReligiousBackground.findOne({ userId });

    // If no existing record, create a new one
    if (!religiousBackground) {
      religiousBackground = new ReligiousBackground({ userId });
      religiousBackground.religion = religion;
      religiousBackground.motherTongue = motherTongue;
      religiousBackground.community = community;
      religiousBackground.subCommunity = subCommunity;
      religiousBackground.gothra = gothra;

      await religiousBackground.save();

      // Log the action as an insertion
      userLogData = {
        userId,
        action: 'Inserted',
        createdBy: userId, // Replace with the actual creator ID
        changeType: 'Insert',
        changes: 'User inserted religious background info.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.status(201).json({
        status: 'true',
        message: 'Religious background information inserted successfully',
        userLogData, // Include userLogData in the response
      });
    } else {
      // Religious background info already exists, update it
      if (religion || motherTongue || community || subCommunity || gothra) {
        if (religion) religiousBackground.religion = religion;
        if (motherTongue) religiousBackground.motherTongue = motherTongue;
        if (community) religiousBackground.community = community;
        if (subCommunity) religiousBackground.subCommunity = subCommunity;
        if (gothra) religiousBackground.gothra = gothra;

        await religiousBackground.save();

        // Log the action as an update
        userLogData = {
          userId,
          action: 'Updated',
          createdBy: userId, // Replace with the actual creator ID
          changeType: 'Update',
          changes: 'User updated religious background info.',
        };

        // Send a POST request to the user-log API
        await axios.post(userLogUrl, userLogData);

        return res.status(200).json({
          status: 'true',
          message: 'Religious background information updated successfully',
          userLogData, // Include userLogData in the response
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};
const createOrUpdateReligiousBackgroundFromAdmin = async (req, res) => {
  const { phone, religion, motherTongue, community, subCommunity, gothra, userUploadingBy} = req.body;
  let userLogData = null;

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

    // Retrieve the existing religious background information
    let religiousBackground = await ReligiousBackground.findOne({ userId:getUserId});

    // If no existing record, create a new one
    if (!religiousBackground) {
      religiousBackground = new ReligiousBackground({ userId:getUserId});
      religiousBackground.religion = religion;
      religiousBackground.motherTongue = motherTongue;
      religiousBackground.community = community;
      religiousBackground.subCommunity = subCommunity;
      religiousBackground.gothra = gothra;

      await religiousBackground.save();

      // Log the action as an insertion
      userLogData = {
        userId:getUserId,
        action: 'Inserted',
        createdBy:userUploadingBy, // Replace with the actual creator ID
        changeType: 'Insert',
        changes: 'User inserted religious background info.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.status(201).json({
        status: 'true',
        message: 'Religious background information inserted successfully',
        userLogData, // Include userLogData in the response
      });
    } else {
      // Religious background info already exists, update it
      if (religion || motherTongue || community || subCommunity || gothra) {
        if (religion) religiousBackground.religion = religion;
        if (motherTongue) religiousBackground.motherTongue = motherTongue;
        if (community) religiousBackground.community = community;
        if (subCommunity) religiousBackground.subCommunity = subCommunity;
        if (gothra) religiousBackground.gothra = gothra;

        await religiousBackground.save();

        // Log the action as an update
        userLogData = {
          userId:getUserId,
          action: 'Updated',
          createdBy: userUploadingBy, // Replace with the actual creator ID
          changeType: 'Update',
          changes: 'User updated religious background info.',
        };

        // Send a POST request to the user-log API
        await axios.post(userLogUrl, userLogData);

        return res.status(200).json({
          status: 'true',
          message: 'Religious background information updated successfully',
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
  createOrUpdateReligiousBackground,
  createOrUpdateReligiousBackgroundFromAdmin
};
