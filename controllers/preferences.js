const axios = require('axios');
const Joi = require('joi'); // Import Joi for validation
const User = require('../model/user'); // Import the User model
const BasicDetailsPreference = require('../model/preference').BasicDetailsPreference; // Import BasicDetailsPreference from the model file
const CommunityPreferences = require('../model/preference').CommunityPreferences; // Import CommunityPreferences from the model file
const LocationPreference = require('../model/preference').locationPreference; // Import CommunityPreferences from the model file
const EducationCareerPreference = require('../model/preference').educationCareerPreference; // Import CommunityPreferences from the model file
const OtherPreferences = require('../model/preference').OtherPreferences; // Import CommunityPreferences from the model file
const mongoose = require('mongoose'); // Import Mongoose for isValidObjectId
const { userLogUrl } = require('../config');

// Controller for creating/updating Basic Details Preferences
const createOrUpdateBasicDetailsPreference = async (req, res) => {
  const { userId, ageRange, heightRange, maritalStatus } = req.body;

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
    let basicDetailsPreference = await BasicDetailsPreference.findOne({ userId });

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (basicDetailsPreference) {
      // Document with userId exists, update it
      basicDetailsPreference.ageRange = ageRange;
      basicDetailsPreference.heightRange = heightRange;
      basicDetailsPreference.maritalStatus = maritalStatus; // Correctly structured object
      action = 'Updated';
    } else {
      // Document with userId does not exist, create a new one
      basicDetailsPreference = new BasicDetailsPreference({
        userId,
        ageRange,
        heightRange,
        maritalStatus, // Correctly structured object
      });
    }

    await basicDetailsPreference.save();

    // Log the action
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Basic Details preferences.'
        : 'User updated Basic Details preferences.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `Basic Details preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};


//Basic Details udate by admin

const createOrUpdateBasicDetailsPreferenceFromAdmin = async (req, res) => {
  const { ageRange, heightRange, maritalStatus, phone, userUploadingBy} = req.body;

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

    // Check if a document with the specified userId exists
    let basicDetailsPreference = await BasicDetailsPreference.findOne({userId:getUserId});

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (basicDetailsPreference) {
      // Document with userId exists, update it
      basicDetailsPreference.ageRange = ageRange;
      basicDetailsPreference.heightRange = heightRange;
      basicDetailsPreference.maritalStatus = maritalStatus; // Correctly structured object
      action = 'Updated';
    } else {
      // Document with userId does not exist, create a new one
      basicDetailsPreference = new BasicDetailsPreference({
        userId:getUserId,
        ageRange,
        heightRange,
        maritalStatus, // Correctly structured object
      });
    }

    await basicDetailsPreference.save();

    // Log the action
    const userLogData = {
      userId:getUserId,
      action,
      createdBy: userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Basic Details preferences.'
        : 'User updated Basic Details preferences.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `Basic Details preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};



const createOrUpdateCommunityPreferences = async (req, res) => {
  const { userId, preferences } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ status: 'false', message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User not found' });
    }

    let communityPreferences = await CommunityPreferences.findOne({ userId });

    let action = 'Inserted';

    if (!communityPreferences) {
      communityPreferences = new CommunityPreferences({
        userId,
      });
    }

    // Update preferences if provided in the request
    if (preferences) {
      if (preferences.religions) {
        communityPreferences.religions = preferences.religions;
      }

      if (preferences.communities) {
        communityPreferences.communities = preferences.communities;
      }

      if (preferences.motherTongues) {
        communityPreferences.motherTongues = preferences.motherTongues;
      }

      if (preferences.gothra) {
        communityPreferences.gothra = preferences.gothra;
      }

      action = 'Updated';
    }

    await communityPreferences.save();

    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Community Preferences.'
        : 'User updated Community Preferences.',
    };

    // Send a POST request to the user-log API if needed
    if (userLogUrl) {
      await axios.post(userLogUrl, userLogData);
    }

    return res.json({ status: 'true', message: `Community Preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

//Community udate by admin
const createOrUpdateCommunityPreferencesFromAdmin = async (req, res) => {
  const {phone,preferences,userUploadingBy} = req.body;

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

    let communityPreferences = await CommunityPreferences.findOne({userId:getUserId});

    let action = 'Inserted';

    if (!communityPreferences) {
      communityPreferences = new CommunityPreferences({
        userId:getUserId,
      });
    }

    // Update preferences if provided in the request
    if (preferences) {
      if (preferences.religions) {
        communityPreferences.religions = preferences.religions;
      }

      if (preferences.communities) {
        communityPreferences.communities = preferences.communities;
      }

      if (preferences.motherTongues) {
        communityPreferences.motherTongues = preferences.motherTongues;
      }

      if (preferences.gothra) {
        communityPreferences.gothra = preferences.gothra;
      }

      action = 'Updated';
    }

    await communityPreferences.save();

    const userLogData = {
      userId:getUserId,
      action,
      createdBy:userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Community Preferences.'
        : 'User updated Community Preferences.',
    };

    // Send a POST request to the user-log API if needed
    if (userLogUrl) {
      await axios.post(userLogUrl, userLogData);
    }

    return res.json({ status: 'true', message: `Community Preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

const createOrUpdateLocationPreferences = async (req, res) => {
  const { userId, locations } = req.body;

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
    let locationPreferences = await LocationPreference.findOne({ userId });

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (locationPreferences) {
      locationPreferences.locations = locations;
      action = 'Updated';
    } else {
      locationPreferences = new LocationPreference({ userId, locations });
    }

    await locationPreferences.save();

    // Log the action
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Location preferences.'
        : 'User updated Location preferences.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `Location preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

//Location udate by admin
const createOrUpdateLocationPreferencesFromAdmin = async (req, res) => {
  const {locations,phone,userUploadingBy } = req.body;

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

    // Check if a document with the specified userId exists
    let locationPreferences = await LocationPreference.findOne({ userId:getUserId});

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (locationPreferences) {
      locationPreferences.locations = locations;
      action = 'Updated';
    } else {
      locationPreferences = new LocationPreference({ userId:getUserId, locations });
    }

    await locationPreferences.save();

    // Log the action
    const userLogData = {
      userId:getUserId,
      action,
      createdBy:userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Location preferences.'
        : 'User updated Location preferences.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `Location preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

// Define a schema for the expected request body
const schemaCareer = Joi.object({
  userId: Joi.string().required(),
  qualifications: Joi.object({
    openToAll: Joi.boolean().required(),
    other: Joi.array().items(Joi.string()).default([]),
  }).required(),
  workingWith: Joi.object({
    openToAll: Joi.boolean().required(),
    other: Joi.array().items(Joi.string()).default([]),
  }).required(),
  professions: Joi.object({
    openToAll: Joi.boolean().required(),
    other: Joi.array().items(Joi.string()).default([]),
  }).required(),
  annualIncome: Joi.object({
    openToAll: Joi.boolean().required(),
    currency: Joi.string().required(),
    incomeFrom: Joi.string().required(),
    incomeTo: Joi.string().required(),
    showBothHiddenAndMatchSetIncomeRange: Joi.boolean().required(), // Add this property to the schema
  }).required(),
});

const createOrUpdateEducationCareerPreferences = async (req, res) => {
  const requestBody = req.body;

  // Validate the request body against the schema
  const { error } = schemaCareer.validate(requestBody);

  if (error) {
    return res.status(400).json({ status: 'false', message: 'Invalid request format', details: error.details });
  }

  try {
    // The rest of your controller logic goes here, assuming the request body is valid

    const {
      userId,
      qualifications,
      workingWith,
      professions,
      annualIncome,
      showBothHiddenAndMatchSetIncomeRange, // Add this field
    } = requestBody;

    // Check if the user exists in your database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User not found' });
    }

    // Check if a document with the specified userId exists
    let educationCareerPreferences = await EducationCareerPreference.findOne({ userId });

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (educationCareerPreferences) {
      educationCareerPreferences.qualifications = qualifications;
      educationCareerPreferences.workingWith = workingWith;
      educationCareerPreferences.professions = professions;
      educationCareerPreferences.annualIncome = annualIncome;
      educationCareerPreferences.showBothHiddenAndMatchSetIncomeRange = showBothHiddenAndMatchSetIncomeRange; // Add this field
      action = 'Updated';
    } else {
      educationCareerPreferences = new EducationCareerPreference({
        userId,
        qualifications,
        workingWith,
        professions,
        annualIncome,
        showBothHiddenAndMatchSetIncomeRange, // Add this field
      });
    }

    await educationCareerPreferences.save();

    // Log the action
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Education and Career preferences.'
        : 'User updated Education and Career preferences.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `Education and Career preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

//EducationCareer udate by admin
const createOrUpdateEducationCareerPreferencesFromAdmin = async (req, res) => {
  const requestBody = req.body;

  // Validate the request body against the schema
  const { error } = schemaCareer.validate(requestBody);

  if (error) {
    return res.status(400).json({ status: 'false', message: 'Invalid request format', details: error.details });
  }

  try {
    // The rest of your controller logic goes here, assuming the request body is valid

    const {
     phone,
      qualifications,
      workingWith,
      professions,
      annualIncome,
      showBothHiddenAndMatchSetIncomeRange,
      userUploadingBy // Add this field
    } = requestBody;

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

    // Check if a document with the specified userId exists
    let educationCareerPreferences = await EducationCareerPreference.findOne({ userId:getUserId});

    // Determine the action (inserted or updated)
    let action = 'Inserted';

    if (educationCareerPreferences) {
      educationCareerPreferences.qualifications = qualifications;
      educationCareerPreferences.workingWith = workingWith;
      educationCareerPreferences.professions = professions;
      educationCareerPreferences.annualIncome = annualIncome;
      educationCareerPreferences.showBothHiddenAndMatchSetIncomeRange = showBothHiddenAndMatchSetIncomeRange; // Add this field
      action = 'Updated';
    } else {
      educationCareerPreferences = new EducationCareerPreference({
        userId:getUserId,
        qualifications,
        workingWith,
        professions,
        annualIncome,
        showBothHiddenAndMatchSetIncomeRange, // Add this field
      });
    }

    await educationCareerPreferences.save();

    // Log the action
    const userLogData = {
      userId:getUserId,
      action,
      createdBy: userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Education and Career preferences.'
        : 'User updated Education and Career preferences.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ status: 'true', message: `Education and Career preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

const otherPreferencesSchema = Joi.object({
  userId: Joi.string().required(),
  profileCreatedBy: Joi.object({
    openToAll: Joi.boolean().required(),
    other: Joi.array().items(Joi.string()).default([]),
  }).required(),
  diet: Joi.object({
    openToAll: Joi.boolean().required(),
    other: Joi.array().items(Joi.string()).default([]),
  }).required(),
});

const createOrUpdateOtherPreferences = async (req, res) => {
  const { userId, profileCreatedBy, diet } = req.body;

  try {
    // Validate the request body against the schema
    const { error } = otherPreferencesSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ status: 'false', message: error.details[0].message });
    }

    // Check if the user exists (You can replace this with your own User model logic)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'false', message: 'User not found' });
    }

    let otherPreferences = await OtherPreferences.findOne({ userId });

    let action = 'Inserted';

    if (otherPreferences) {
      otherPreferences.profileCreatedBy = profileCreatedBy;
      otherPreferences.diet = diet;
      action = 'Updated';
    } else {
      otherPreferences = new OtherPreferences({
        userId,
        profileCreatedBy,
        diet,
      });
    }

    await otherPreferences.save();

    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Other Preferences.'
        : 'User updated Other Preferences.',
    };

    if (userLogUrl) {
      await axios.post(userLogUrl, userLogData);
    }

    return res.json({ status: 'true', message: `Other Preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

//Other udated by admin
const createOrUpdateOtherPreferencesFromAdmin = async (req, res) => {
  const { phone, profileCreatedBy, diet,userUploadingBy } = req.body;

  try {
    // Validate the request body against the schema
    const { error } = otherPreferencesSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ status: 'false', message: error.details[0].message });
    }

    // Check if the user exists (You can replace this with your own User model logic)
    if (!phone) {
      return res.status(400).json({ status: 'false', message: 'Phone Number is required' });
    }

    // Check if the user exists in your database
    const mobile = {phone: phone};
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


    let otherPreferences = await OtherPreferences.findOne({ userId:getUserId});

    let action = 'Inserted';

    if (otherPreferences) {
      otherPreferences.profileCreatedBy = profileCreatedBy;
      otherPreferences.diet = diet;
      action = 'Updated';
    } else {
      otherPreferences = new OtherPreferences({
        userId:getUserId,
        profileCreatedBy,
        diet,
      });
    }

    await otherPreferences.save();

    const userLogData = {
      userId:getUserId,
      // phone:phone,
      action,
      createdBy: userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? 'User inserted Other Preferences.'
        : 'User updated Other Preferences.',
    };

    if (userLogUrl) {
      await axios.post(userLogUrl, userLogData);
    }

    return res.json({ status: 'true', message: `Other Preferences ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: error.message });
  }
};

//Get User Basic Preference Data
const returnBasicPreference = async (req, res) => {
  const { userId, email, phone } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }

    // Create a query object to include fields that are present
    const query = { _id: userId };

    if (email) {
      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format. Please provide a valid email address.',
        });
      }
      query.email = email;
    }

    if (phone) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone format. Please provide a valid phone number.',
        });
      }
      query.phone = phone;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your provided information.',
      });
    }

    if (user.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'User registration is incomplete. Please complete the registration process.',
      });
    }

    const queryId = { userId: userId };
    const userData = await BasicDetailsPreference.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userBasicPreference: { ageRange: userData.ageRange, heightRange: userData.heightRange, maritalStatus: userData.maritalStatus},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};

// return community preference info
const returnCommunityPreference = async (req, res) => {
  const { userId, email, phone } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }

    // Create a query object to include fields that are present
    const query = { _id: userId };

    if (email) {
      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format. Please provide a valid email address.',
        });
      }
      query.email = email;
    }

    if (phone) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone format. Please provide a valid phone number.',
        });
      }
      query.phone = phone;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your provided information.',
      });
    }

    if (user.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'User registration is incomplete. Please complete the registration process.',
      });
    }

    const queryId = { userId: userId };
    const userData = await CommunityPreferences.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userCommunityPreference: { religions: userData.religions, communities: userData.communities, motherTongues: userData.motherTongues, gothra: userData.gothra},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};

// Return Education and Career Preference Info
const returnCareerAndEducationPreference = async (req, res) => {  
  const { userId, email, phone } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }

    // Create a query object to include fields that are present
    const query = { _id: userId };

    if (email) {
      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format. Please provide a valid email address.',
        });
      }
      query.email = email;
    }

    if (phone) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone format. Please provide a valid phone number.',
        });
      }
      query.phone = phone;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your provided information.',
      });
    }

    if (user.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'User registration is incomplete. Please complete the registration process.',
      });
    }

    const queryId = { userId: userId };
    const userData = await EducationCareerPreference.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userEduPreference: { qualifications: userData.qualifications, workingWith: userData.workingWith, professions: userData.professions, annualIncome: userData.annualIncome},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};

// Return Location Preference Info
const returnLocationPreference = async (req, res) => {
  const { userId, email, phone } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }

    // Create a query object to include fields that are present
    const query = { _id: userId };

    if (email) {
      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format. Please provide a valid email address.',
        });
      }
      query.email = email;
    }

    if (phone) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone format. Please provide a valid phone number.',
        });
      }
      query.phone = phone;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your provided information.',
      });
    }

    if (user.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'User registration is incomplete. Please complete the registration process.',
      });
    }

    const queryId = { userId: userId };
    const userData = await LocationPreference.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userLocationPreference: { locations: userData.locations},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};

// Return Other Preference Info
const returnOtherPreference = async (req, res) => {
  const { userId, email, phone } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }

    // Create a query object to include fields that are present
    const query = { _id: userId };

    if (email) {
      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format. Please provide a valid email address.',
        });
      }
      query.email = email;
    }

    if (phone) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone format. Please provide a valid phone number.',
        });
      }
      query.phone = phone;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your provided information.',
      });
    }

    if (user.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'User registration is incomplete. Please complete the registration process.',
      });
    }

    const queryId = { userId: userId };
    const userData = await OtherPreferences.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userOtherPreference: { profileCreatedBy: userData.profileCreatedBy, diet: userData.diet},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = {
    createOrUpdateBasicDetailsPreference,
    createOrUpdateCommunityPreferences,
    createOrUpdateLocationPreferences,
    createOrUpdateEducationCareerPreferences,
    createOrUpdateOtherPreferences,
    returnBasicPreference,
    returnCommunityPreference,
    returnCareerAndEducationPreference,
    returnLocationPreference,
    returnOtherPreference,

    //admin
    createOrUpdateBasicDetailsPreferenceFromAdmin,
    createOrUpdateCommunityPreferencesFromAdmin,
    createOrUpdateLocationPreferencesFromAdmin,
    createOrUpdateEducationCareerPreferencesFromAdmin,
    createOrUpdateOtherPreferencesFromAdmin
};
