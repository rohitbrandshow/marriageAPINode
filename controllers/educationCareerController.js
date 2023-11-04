const axios = require('axios');
const EducationCareerInfo = require('../model/educationalCareerDetails');
const User = require('../model/user');
const { userLogUrl } = require('../config');

// Controller for creating/updating education and career information
const createOrUpdateEducationCareerInfo = async (req, res) => {
  const {
    userId,
    highestQualification,
    collegesAttended, // An array of college attended objects
    workingStatus,
    jobTitle,
    employerName,
    annualIncome,
    isIncomePrivate,
    // Additional fields as needed
  } = req.body;

  try {
    let educationCareerInfo = await EducationCareerInfo.findOne({ userId });

    if (!educationCareerInfo) {
      educationCareerInfo = new EducationCareerInfo({ userId });
    }

    const updatedFields = {}; // Store updated fields for logging
    let action = 'Inserted'; // Initialize the action as "Inserted"

    // Check if any data fields were provided in the request
    const hasDataToUpdate =
      highestQualification || collegesAttended || workingStatus ||
      jobTitle || employerName || annualIncome || isIncomePrivate;

    if (hasDataToUpdate) {
      // Update education and career-related information if provided in the request
      if (highestQualification) {
        educationCareerInfo.highestQualification = highestQualification;
        updatedFields.highestQualification = highestQualification;
      }

      if (collegesAttended) {
        educationCareerInfo.collegesAttended = collegesAttended.map((college) => ({
          collegeName: college.collegeName,
        }));
        updatedFields.collegesAttended = collegesAttended;
      }

      if (workingStatus) {
        educationCareerInfo.workingStatus = workingStatus;
        updatedFields.workingStatus = workingStatus;
      }

      if (jobTitle) {
        educationCareerInfo.jobDetails.jobTitle = jobTitle;
        updatedFields.jobTitle = jobTitle;
      }

      if (employerName) {
        educationCareerInfo.jobDetails.employerName = employerName;
        updatedFields.employerName = employerName;
      }

      if (annualIncome) {
        educationCareerInfo.jobDetails.annualIncome = annualIncome;
        updatedFields.annualIncome = annualIncome;
      }

      if (isIncomePrivate) {
        educationCareerInfo.jobDetails.isIncomePrivate = isIncomePrivate;
        updatedFields.isIncomePrivate = isIncomePrivate;
      }

      // Additional fields can be updated similarly.

      // If any fields were updated, change the action to "Updated"
      action = 'Updated';
    }

    await educationCareerInfo.save();

    // Log the action as an insertion/update
    const userLogData = {
      userId,
      action,
      createdBy: userId, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? `User inserted education and career info: ${JSON.stringify(updatedFields)}`
        : `User updated education and career info: ${JSON.stringify(updatedFields)}`,
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    const message = action === 'Inserted'
      ? 'Education and career information inserted successfully'
      : 'Education and career information updated successfully';

    return res.json({ status: 'true', message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
};



///Added By Admin
const createOrUpdateEducationCareerInfoFromAdmin = async (req, res) => {
  const {
    phone,
    highestQualification,
    collegesAttended, // An array of college attended objects
    workingStatus,
    jobTitle,
    employerName,
    annualIncome,
    isIncomePrivate,
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
      
    const userEduction = { userId: getUserId };
    let educationCareerInfo = await EducationCareerInfo.findOne(userEduction);

    if (!educationCareerInfo) {
      educationCareerInfo = new EducationCareerInfo(userEduction);
    }

    const updatedFields = {}; // Store updated fields for logging
    let action = 'Inserted'; // Initialize the action as "Inserted"

    // Check if any data fields were provided in the request
    const hasDataToUpdate =
      highestQualification || collegesAttended || workingStatus ||
      jobTitle || employerName || annualIncome || isIncomePrivate;

    if (hasDataToUpdate) {
      // Update education and career-related information if provided in the request
      if (highestQualification) {
        educationCareerInfo.highestQualification = highestQualification;
        updatedFields.highestQualification = highestQualification;
      }

      if (collegesAttended) {
        educationCareerInfo.collegesAttended = collegesAttended.map((college) => ({
          collegeName: college.collegeName,
        }));
        updatedFields.collegesAttended = collegesAttended;
      }

      if (workingStatus) {
        educationCareerInfo.workingStatus = workingStatus;
        updatedFields.workingStatus = workingStatus;
      }

      if (jobTitle) {
        educationCareerInfo.jobDetails.jobTitle = jobTitle;
        updatedFields.jobTitle = jobTitle;
      }

      if (employerName) {
        educationCareerInfo.jobDetails.employerName = employerName;
        updatedFields.employerName = employerName;
      }

      if (annualIncome) {
        educationCareerInfo.jobDetails.annualIncome = annualIncome;
        updatedFields.annualIncome = annualIncome;
      }

      if (isIncomePrivate) {
        educationCareerInfo.jobDetails.isIncomePrivate = isIncomePrivate;
        updatedFields.isIncomePrivate = isIncomePrivate;
      }

      // Additional fields can be updated similarly.

      // If any fields were updated, change the action to "Updated"
      action = 'Updated';
    }

    await educationCareerInfo.save();

    // Log the action as an insertion/updates
    const userLogData = {
      userId: getUserId,
      action,
      createdBy: userUploadingBy, // Replace with the actual creator ID
      changeType: action === 'Inserted' ? 'Insert' : 'Update',
      changes: action === 'Inserted'
        ? `User inserted education and career info: ${JSON.stringify(updatedFields)}`
        : `User updated education and career info: ${JSON.stringify(updatedFields)}`,
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    const message = action === 'Inserted'
      ? 'Education and career information inserted successfully'
      : 'Education and career information updated successfully';

    return res.json({ status: 'true', message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
};

module.exports = {
  createOrUpdateEducationCareerInfo,
  createOrUpdateEducationCareerInfoFromAdmin

};