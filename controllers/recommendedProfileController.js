// const axios = require('axios');
// const { userLogUrl } = require('../config');

const BasicInfo = require('../model/basicInfo');
const EducationCareerInfo = require('../model/educationalCareerDetails');
const FamilyInfo = require('../model/familyInfo');
const LifestyleInfo = require('../model/lifeStyle');
const ReligiousBackground = require('../model/religiousBackground');

const User = require('../model/user');
const {
    BasicDetailsPreference,
    CommunityPreferences,
    locationPreference,
    educationCareerPreference,
    OtherPreferences,
} = require('../model/preference');

const returnRecommendedProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the user by their userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create an empty query object to build your select query
        const selectQuery = {};

        if (user.gender) {
            selectQuery.gender = user.gender === 'Male' ? 'Female' : 'Male';
        }

        // Handle BasicDetailsPreference
        const basicDetailsPreference = await BasicDetailsPreference.findOne({ userId });
        if (basicDetailsPreference) {
            if (basicDetailsPreference.ageRange) {
                selectQuery.age = {
                    $gte: basicDetailsPreference.ageRange.min,
                    $lte: basicDetailsPreference.ageRange.max,
                };
            }

            if (basicDetailsPreference.heightRange) {
                selectQuery.height = {
                    $gte: basicDetailsPreference.heightRange.min,
                    $lte: basicDetailsPreference.heightRange.max,
                };
            }

            if (basicDetailsPreference.maritalStatus) {
                if (!basicDetailsPreference.maritalStatus.openToAll) {
                    selectQuery.maritalStatus = {
                        $in: basicDetailsPreference.maritalStatus.other,
                    };
                }
            }
        }

        // Handle CommunityPreferences
        const communityPreferences = await CommunityPreferences.findOne({ userId });
        if (communityPreferences) {
            if (communityPreferences.religions.openToAll) {
                // No need to filter based on religions
            } else if (communityPreferences.religions.other.length > 0) {
                selectQuery.religion = {
                    $in: communityPreferences.religions.other,
                };
            }

            if (communityPreferences.communities.openToAll) {
                // No need to filter based on communities
            } else if (communityPreferences.communities.other.length > 0) {
                selectQuery.community = {
                    $in: communityPreferences.communities.other,
                };
            }

            if (communityPreferences.motherTongues.openToAll) {
                // No need to filter based on mother tongues
            } else if (communityPreferences.motherTongues.other.length > 0) {
                selectQuery.motherTongue = {
                    $in: communityPreferences.motherTongues.other,
                };
            }

            if (!communityPreferences.gothra.openToAll) {
                if (communityPreferences.gothra.dontIncludeMyGothra) {
                    // Exclude profiles with the user's gothra
                    selectQuery.gothra = {
                        $nin: user.gothra, // Replace 'user.gothra' with the user's actual gothra
                    };
                }
            }
        }


        // Handle locationPreference
        const locationPref = await locationPreference.findOne({ userId });
        if (locationPref) {
            if (locationPref.locations && locationPref.locations.length > 0) {
                selectQuery.location = {
                    $in: locationPref.locations,
                };
            }
        }

        const educationCareerPreferences = await educationCareerPreference.findOne({ userId });
        if (educationCareerPreferences) {
            if (educationCareerPreferences.qualifications) {
                if (!educationCareerPreferences.qualifications.openToAll) {
                    selectQuery.qualifications = {
                        $in: educationCareerPreferences.qualifications.other,
                    };
                }
            }

            if (educationCareerPreferences.workingWith) {
                if (!educationCareerPreferences.workingWith.openToAll) {
                    selectQuery.workingWith = {
                        $in: educationCareerPreferences.workingWith.other,
                    };
                }
            }

            if (educationCareerPreferences.professions) {
                if (!educationCareerPreferences.professions.openToAll) {
                    selectQuery.professions = {
                        $in: educationCareerPreferences.professions.other,
                    };
                }
            }

            if (educationCareerPreferences.annualIncome) {
                if (!educationCareerPreferences.annualIncome.openToAll) {
                    // Filter profiles by annual income range
                    const incomeQuery = {};
                    if (educationCareerPreferences.annualIncome.currency) {
                        incomeQuery.currency = educationCareerPreferences.annualIncome.currency;
                    }
                    if (educationCareerPreferences.annualIncome.incomeFrom) {
                        incomeQuery.$gte = educationCareerPreferences.annualIncome.incomeFrom;
                    }
                    if (educationCareerPreferences.annualIncome.incomeTo) {
                        incomeQuery.$lte = educationCareerPreferences.annualIncome.incomeTo;
                    }

                    selectQuery.annualIncome = incomeQuery;
                }
            }
        }

        // Handle OtherPreferences
        const otherPreferences = await OtherPreferences.findOne({ userId });
        if (otherPreferences) {
            if (otherPreferences.profileCreatedBy) {
                if (!otherPreferences.profileCreatedBy.openToAll) {
                    selectQuery.profileCreatedBy = {
                        $in: otherPreferences.profileCreatedBy.other,
                    };
                }
            }

            if (otherPreferences.diet) {
                if (!otherPreferences.diet.openToAll) {
                    selectQuery.diet = {
                        $in: otherPreferences.diet.other,
                    };
                }
            }
        }

        // Perform a database query using selectQuery to find recommended profiles
        const recommendedProfiles = await User.find(selectQuery);

        // Return the recommended profiles
        return res.status(200).json({
            message: 'Recommended profiles based on user preferences',
            query: selectQuery,
            recommendedProfiles,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    returnRecommendedProfile
};