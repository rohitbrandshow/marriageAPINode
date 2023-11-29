const User = require('../model/user'); // Import the User model
const AboutUser = require('../model/aboutUser'); // Import the User model
const BasicInfo = require('../model/basicInfo'); // Import the User model
const ReligiousBackground = require('../model/religiousBackground'); // Import the User model
const FamilyInfo = require('../model/familyInfo'); // Import the User model
const EducationalCareerDetails = require('../model/educationalCareerDetails'); // Import the User model
const BasicDetailsPreference = require('../model/preference').BasicDetailsPreference;
const CommunityPreferences = require('../model/preference').CommunityPreferences;
const LifeStyle = require('../model/lifeStyle'); // Import the User model
const mongoose = require('mongoose'); // Import Mongoose for isValidObjectId
const moment = require('moment');


const returnUserDataFromUserTable = async (req, res) => {
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

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      user: { name: user.name, email: user.email, phone: user.phone, gender: user.gender, userType: user.userType, verificationCode: user.verificationCode, mobileVerified: user.mobileVerified, emailVerified: user.emailVerified},
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

// Return About User
const returnUserAboutDataFromAboutTable = async (req, res) => {
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
    const userData = await AboutUser.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userAbout: { aboutText: userData.aboutText },
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



//Return User Basic Info
const returnUserBasicInfoFromBasicInfoTable = async (req, res) => {
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
    const userData = await BasicInfo.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userBasicInfo: { profileCreatedBy: userData.profileCreatedBy, dateOfBirth: userData.dateOfBirth, disability: userData.healthInformation.disability, bloodGroup: userData.healthInformation.bloodGroup, dob: userData.dateOfBirth, placeOfBirth: userData.placeOfBirth, maritalStatus: userData.maritalStatus, height: userData.height, skinColor: userData.skinColor },
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


//Return Religious
const returnUserReligiousInfo = async (req, res) => {
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
    const userData = await ReligiousBackground.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userBasicInfo: { religion: userData.religion, motherTongue: userData.motherTongue, community: userData.community, subCommunity: userData.subCommunity, gothra: userData.gothra},
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


//Return Family Info
const returnFamilyInfo = async (req, res) => {
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
    const userData = await FamilyInfo.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userFamilyInfo: { numberOfSiblings: userData.siblings.numberOfSiblings, notMarriedSiblings: userData.siblings.notMarried, marriedSiblings: userData.siblings.married, fatherStatus: userData.fatherStatus, motherStatus: userData.motherStatus, familyLocation: userData.familyLocation, nativePlace: userData.nativePlace, familyType: userData.familyType, familyValues: userData.familyValues, familyAffluence: userData.familyAffluence},
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


//Return Educational Info
const returnEducationAndCareerInfo = async (req, res) => {
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
    const userData = await EducationalCareerDetails.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userEduInfo: { jobTitle: userData.jobDetails.jobTitle, employerName: userData.jobDetails.employerName, annualIncome: userData.jobDetails.annualIncome, collegesAttended: userData.collegesAttended, highestQualification: userData.highestQualification, workingStatus: userData.workingStatus, isIncomePrivate: userData.jobDetails.isIncomePrivate},
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

//Get User LifeStyle Info
const returnLifeStyleInfo = async (req, res) => {
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
    const userData = await LifeStyle.findOne(queryId);

    if (!userData) {
      return res.status(204).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userLifeStyleInfo: { diet: userData.diet},
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


//Get User id from mobile number
const returnUserDataFromNumber = async (req, res) => {
  const { userId, phone } = req.body;

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
    query.userType = 'Admin';

    const user = await User.findOne(query);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Oops You are not Admin. You dont have permission to perform this action',
      });
    }

    const queryPhone = { phone: phone };
    const userData = await User.findOne(queryPhone);

    if (!userData) {
      return res.status(200).json({
        success: false,
        message: 'User data not found.',
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userData: { id: userData.id },
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


const returnUserDataFromUserTableUsingUserId = async (req, res) => {
  const { userId} = req.body;

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

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, gender: user.gender, userType: user.userType },
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

const returnUserBasicInfoFromBasicInfoTableUsingUserID = async (req, res) => {
  const { userId} = req.body;

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
    const userData = await BasicInfo.findOne(queryId);

    if (!userData) {
      return res.json({
        success: false,
        message: 'User data not found',
        userBasicInfo: { profileCreatedBy: '', dateOfBirth: '', disability: '', bloodGroup: '', dob: '', placeOfBirth: '', maritalStatus:'', height: '', skinColor: ''},
      });
    }

    return res.json({
      success: true,
      message: 'User data retrieved successfully.',
      userBasicInfo: { profileCreatedBy: userData.profileCreatedBy, dateOfBirth: userData.dateOfBirth, disability: userData.healthInformation.disability, bloodGroup: userData.healthInformation.bloodGroup, dob: userData.dateOfBirth, placeOfBirth: userData.placeOfBirth, maritalStatus: userData.maritalStatus, height: userData.height, skinColor: userData.skinColor },
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


const returnMatchValue = async (req, res) => {
  const { personID, personMatchingWithID } = req.body;

  try {
    if (!personID || !personMatchingWithID) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID for Match.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(personID) || !mongoose.Types.ObjectId.isValid(personMatchingWithID)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }

    // Create a query object to include fields that are present
    const person = { _id: personID };
    const user1 = await User.findOne(person);

    const person2 = { _id: personMatchingWithID };
    const user2 = await User.findOne(person2);

    if (!user1 || !user2) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your provided information.',
      });
    }

    if (user2.status !== 'active' || user1.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'User registration is incomplete. Please complete the registration process.',
      });
    }

    let age = true;
    let height = true;
    let maritalStatus = true;
    let religion = true;
    let motherTongue = true;
    let totalMatch = 0;

    // Get Person Basic Information
    const queryId = { userId: personID };
    const userData = await BasicInfo.findOne(queryId);
    const userReligiousBackgroundData = await ReligiousBackground.findOne(queryId);

    if (!userData) {
      age = false;
      height = false;
      maritalStatus = false;
    }

    if (!userReligiousBackgroundData) {
      motherTongue = false;
      religion = false;
    }

    // Get Person Matching with Basic Preference
    const queryId2 = { userId: personMatchingWithID };
    const getPreferenceOfPersonMatchingWith = await BasicDetailsPreference.findOne(queryId2);
    const getCommunityOfPersonMatchingWith = await CommunityPreferences.findOne(queryId2);

    if (!getPreferenceOfPersonMatchingWith) {
      age = false;
      height = false;
      maritalStatus = false;
    }

    if (!getCommunityOfPersonMatchingWith) {
      motherTongue = false;
      religion = false;
    }

    // Get Person 1 Data
    const calculatePersonAge = calculateAge(userData.dateOfBirth);
    const getPersonAge = calculatePersonAge.years;
    const getPersonHeight = userData.height;

    // Get PersonWithMatching Data
    const getMinHeight = getPreferenceOfPersonMatchingWith.heightRange.min;
    const getMaxHeight = getPreferenceOfPersonMatchingWith.heightRange.max;
    const getMinAge = getPreferenceOfPersonMatchingWith.ageRange ? getPreferenceOfPersonMatchingWith.ageRange.min : null;
    const getMaxAge = getPreferenceOfPersonMatchingWith.ageRange ? getPreferenceOfPersonMatchingWith.ageRange.max : null;

    // Calculate Age
    if (age && userData && getPreferenceOfPersonMatchingWith && getMinAge !== null && getMaxAge !== null) {
      if (getPersonAge === getMaxAge || getPersonAge === getMinAge || (getPersonAge > getMinAge && getPersonAge < getMaxAge)) {
        age = true;
        totalMatch = totalMatch + 1;
      } else {
        age = false;
      }
    }

    // Calculate Height
    if (height && userData && getPreferenceOfPersonMatchingWith) {
      if (
        getPersonHeight === getMaxHeight ||
        getPersonHeight === getMinHeight ||
        (getPersonHeight > getMinHeight && getPersonHeight < getMaxHeight)
      ) {
        height = true;
        totalMatch = totalMatch + 1; // Increment totalMatch when height matches
      } else {
        height = false;
      }
    }

    // Calculate Religion
    if (religion && userData && getPreferenceOfPersonMatchingWith) {
      const userReligion = userReligiousBackgroundData.religion;
      const preferredReligions = getCommunityOfPersonMatchingWith.religions.other;

      if (
        (getCommunityOfPersonMatchingWith.religions.openToAll && userReligion) ||
        (userReligion && preferredReligions && preferredReligions.includes(userReligion))
      ) {
        religion = true;
        totalMatch = totalMatch + 1;
      } else {
        religion = false;
      }
    }

    // Calculate Mother Tongue
    if (motherTongue && userData && getPreferenceOfPersonMatchingWith) {
      const userMotherTongue = userReligiousBackgroundData.motherTongue;
      const preferredMotherTongues = getCommunityOfPersonMatchingWith.motherTongues.other;

      if (
        (getCommunityOfPersonMatchingWith.motherTongues.openToAll && userMotherTongue) ||
        (userMotherTongue && preferredMotherTongues && preferredMotherTongues.includes(userMotherTongue))
      ) {
        motherTongue = true;
        totalMatch = totalMatch + 1;
      } else {
        motherTongue = false;
      }
    }

    // Calculate Marital Status
    if (maritalStatus && userData && getPreferenceOfPersonMatchingWith) {
      const getPersonMaritalStatus = userData.maritalStatus;
      const getMaritalStatusOpenToAll = getPreferenceOfPersonMatchingWith.maritalStatus.openToAll;
      const getMaritalStatusData = getPreferenceOfPersonMatchingWith.maritalStatus.other;

      if (
        getMaritalStatusOpenToAll ||
        (Array.isArray(getMaritalStatusData) && getMaritalStatusData.includes(getPersonMaritalStatus))
      ) {
        maritalStatus = true;
        totalMatch = totalMatch + 1; // Increment totalMatch when marital status matches
      } else {
        maritalStatus = false;
      }
    }

    return res.json({
      success: true,
      data: {
        age,
        height,
        maritalStatus,
        religion,
        motherTongue,
        totalMatch
      },
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

function calculateAge(birthDate) {
  const birthMoment = moment(birthDate);
  const currentMoment = moment();

  const years = currentMoment.diff(birthMoment, 'years');
  birthMoment.add(years, 'years');

  const months = currentMoment.diff(birthMoment, 'months');
  birthMoment.add(months, 'months');

  const days = currentMoment.diff(birthMoment, 'days');

  return {
    years,
    months,
    days,
  };
}


module.exports = {
  returnUserDataFromUserTable,
  returnUserAboutDataFromAboutTable,
  returnUserBasicInfoFromBasicInfoTable,
  returnUserReligiousInfo,
  returnFamilyInfo,
  returnEducationAndCareerInfo,
  returnLifeStyleInfo,
  returnUserDataFromNumber,
  returnUserDataFromUserTableUsingUserId,
  returnUserBasicInfoFromBasicInfoTableUsingUserID,
  returnMatchValue
};
