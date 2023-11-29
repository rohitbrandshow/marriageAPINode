const BasicInfo = require('../model/basicInfo');
const EducationCareerInfo = require('../model/educationalCareerDetails');
const FamilyInfo = require('../model/familyInfo');
const LifestyleInfo = require('../model/lifeStyle');
const ReligiousBackground = require('../model/religiousBackground');
const mongoose = require('mongoose'); // Import Mongoose for isValidObjectId
const getClient = require("mongodb-atlas-api-client");

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

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format. Please provide a valid user ID.',
            });
        }

        // Find the user by their userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Collect all user preferences
        const basicDetailsPreference = await BasicDetailsPreference.findOne({ userId });
        const communityPreferences = await CommunityPreferences.findOne({ userId });
        const locationPref = await locationPreference.findOne({ userId });
        const educationCareerPreferences = await educationCareerPreference.findOne({ userId });
        const otherPreferences = await OtherPreferences.findOne({ userId });

        // Create an array to store the tables to query
        const tablesToQuery = [];

        // Create an array to store the queries for debugging
        const queries = [];

        // Based on preferences, add tables to query
        if (basicDetailsPreference) {
            tablesToQuery.push(BasicInfo);
            queries.push({ table: 'BasicInfo', query: {} });
        }

        if (communityPreferences) {
            tablesToQuery.push(ReligiousBackground, FamilyInfo);

            if (communityPreferences.religions.openToAll) {
                tablesToQuery.push(LifestyleInfo);
            }

            queries.push({ table: 'ReligiousBackground', query: {} });
            queries.push({ table: 'FamilyInfo', query: {} });

            if (communityPreferences.religions.openToAll) {
                queries.push({ table: 'LifestyleInfo', query: {} });
            }
        }

        if (locationPref) {
            tablesToQuery.push(User);
            queries.push({ table: 'User', query: {} });
        }

        if (educationCareerPreferences) {
            tablesToQuery.push(EducationCareerInfo);
            queries.push({ table: 'EducationCareerInfo', query: {} });
        }

        if (otherPreferences) {
            tablesToQuery.push(LifestyleInfo);
            queries.push({ table: 'LifestyleInfo', query: {} });
        }

        // Construct the query to find user profiles
        const selectQuery = {};
        selectQuery._id = { $ne: userId }; // Exclude the user's own profile
        selectQuery.gender = user.gender === 'Male' ? 'Female' : 'Male';

        // Create an array of promises for each table's query
        const queryPromises = tablesToQuery.map(async (table, index) => {
            // For each table, construct a query based on the preferences of the requested user
            const tableQuery = { ...selectQuery };

            if (basicDetailsPreference && basicDetailsPreference.ageRange) {
                tableQuery.age = {
                    $gte: basicDetailsPreference.ageRange.min,
                    $lte: basicDetailsPreference.ageRange.max,
                };
            }

            // Add other preference conditions based on the table

            queries[index].query = tableQuery; // Update the query for debugging

            // Execute the query and return user IDs
            const result = await table.find(tableQuery, 'userId');
            return result.map((row) => row.userId);
        });

        // Execute all query promises and flatten the result
        const results = await Promise.all(queryPromises);
        const recommendedUserIds = [].concat(...results);

        // Return the recommended user IDs along with the queries for debugging
        return res.status(200).json({
            message: 'Recommended profiles based on user preferences',
            recommendedUserIds,
            queries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const returnRecommendedProfileWithFewCriteria = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format. Please provide a valid user ID.',
            });
        }

        // Find the user by their userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the user's preferences from BasicDetailsPreference
        const basicDetailsPreference = await BasicDetailsPreference.findOne({ userId });
        const educationCareerPreferences = await educationCareerPreference.findOne({ userId });

        // Get the user IDs of opposite gender (e.g., 'Male' if user is 'Female')
        const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';
        const oppositeGenderUserIds = await User.find(
            { gender: oppositeGender, userType: 'User', _id: { $ne: userId } },
            '_id'
        ).distinct('_id');

        // If basicDetailsPreference not found, return only oppositeGenderUserIds
        if (!basicDetailsPreference) {
            return res.status(200).json({
                message: 'User preferences for heightRange and ageRange are not found.',
                recommendedUserIds: [],
                oppositeGenderUserIds: oppositeGenderUserIds.map((id) => id.toString()),
            });
        }

        // Continue with the rest of the code to calculate age, create the query, and find matching profiles
        const { heightRange, ageRange } = basicDetailsPreference;
        const userAge = user.dateOfBirth
            ? Math.floor((new Date() - new Date(user.dateOfBirth)) / 31556952000)
            : 0;

        const currentYear = new Date().getFullYear();
        const minBirthYear = currentYear - ageRange.max;
        const maxBirthYear = currentYear - ageRange.min;

        const selectQuery = {};
        selectQuery._id = { $ne: userId };

        selectQuery.height = {
            $gte: heightRange.min,
            $lte: heightRange.max,
        };

        selectQuery.dateOfBirth = {
            $gte: new Date(`${minBirthYear}-01-01`),
            $lte: new Date(`${maxBirthYear}-12-31`),
        };

        const matchingProfiles = await BasicInfo.find(selectQuery);

        const recommendedUserIds = matchingProfiles.map((profile) => profile.userId);

        const filteredRecommendedUserIds = recommendedUserIds.filter(
            (id) => id.toString() !== userId
        );

        return res.status(200).json({
            message: 'Recommended profiles based on user preferences',
            recommendedUserIds: filteredRecommendedUserIds,
            oppositeGenderUserIds: oppositeGenderUserIds.map((id) => id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const searchProfiles = async (req, res) => {
    try {
        const { userId, searchCriteria } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format. Please provide a valid user ID.',
            });
        }

        // Find the user by their userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Define a query object for the search
        const searchQuery = {};

        // Define a mapping of search criteria to database fields
        const searchCriteriaMap = {
            heightRange: { field: 'height', operator: 'range' },
            ageRange: { field: 'dateOfBirth', operator: 'ageRange' },
            // Add more criteria mappings here as needed
        };

        // Loop through the provided search criteria and build the query dynamically
        for (const key in searchCriteria) {
            if (searchCriteriaMap[key]) {
                const { field, operator } = searchCriteriaMap[key];
                const { min, max } = searchCriteria[key];

                if (operator === 'range') {
                    searchQuery[field] = {
                        $gte: min,
                        $lte: max,
                    };
                } else if (operator === 'ageRange') {
                    const currentYear = new Date().getFullYear();
                    const minBirthYear = currentYear - max;
                    const maxBirthYear = currentYear - min;

                    searchQuery[field] = {
                        $gte: new Date(`${minBirthYear}-01-01`),
                        $lte: new Date(`${maxBirthYear}-12-31`),
                    };
                }
            }
        }

        // Find matching profiles based on the constructed query
        const matchingProfiles = await BasicInfo.find(searchQuery);

        // Extract user IDs of matching profiles
        const matchingUserIds = matchingProfiles.map((profile) => profile.userId);

        // Filter out the current user's ID from the matching results
        const filteredMatchingUserIds = matchingUserIds.filter((id) => id.toString() !== userId);

        // Get the user IDs of opposite gender
        const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';
        const oppositeGenderUserIds = await User.find(
            { gender: oppositeGender, userType: 'User', _id: { $ne: userId } },
            '_id'
        ).distinct('_id');

        // Filter the matching user IDs to include only those of opposite gender
        const oppositeGenderMatchingUserIds = filteredMatchingUserIds.filter((id) =>
            oppositeGenderUserIds.includes(id)
        );

        return res.status(200).json({
            message: 'Profiles matching the search criteria',
            matchingUserIds: oppositeGenderMatchingUserIds,
            oppositeGenderUserIds: oppositeGenderUserIds.map((id) => id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const searchFiveProfiles = async (req, res) => {
    try {
        const { userId, searchCriteria } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format. Please provide a valid user ID.',
            });
        }

        // Find the user by their userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Define a query object for the search
        const searchQuery = {};

        // Define a mapping of search criteria to database fields
        const searchCriteriaMap = {
            heightRange: { field: 'height', operator: 'range' },
            ageRange: { field: 'dateOfBirth', operator: 'ageRange' },
            // Add more criteria mappings here as needed
        };

        // Loop through the provided search criteria and build the query dynamically
        for (const key in searchCriteria) {
            if (searchCriteriaMap[key]) {
                const { field, operator } = searchCriteriaMap[key];
                const { min, max } = searchCriteria[key];

                if (operator === 'range') {
                    searchQuery[field] = {
                        $gte: min,
                        $lte: max,
                    };
                } else if (operator === 'ageRange') {
                    const currentYear = new Date().getFullYear();
                    const minBirthYear = currentYear - max;
                    const maxBirthYear = currentYear - min;

                    searchQuery[field] = {
                        $gte: new Date(`${minBirthYear}-01-01`),
                        $lte: new Date(`${maxBirthYear}-12-31`),
                    };
                }
            }
        }

        // Find matching profiles based on the constructed query
        const matchingProfiles = await BasicInfo.find(searchQuery).limit(5).lean();

        // Extract user IDs of matching profiles
        const matchingUserIds = matchingProfiles.map((profile) => profile.userId);

        // Get the user IDs of opposite gender
        const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';
        const oppositeGenderUserIds = await User.find(
            { gender: oppositeGender, userType: 'User', _id: { $ne: userId } },
            '_id'
        ).limit(5).lean();

        return res.status(200).json({
            message: 'First 5 profiles matching the search criteria',
            matchingUserIds: matchingUserIds,
            oppositeGenderUserIds: oppositeGenderUserIds.map((doc) => doc._id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Atlas Connection Start
const getAtlasSearchClient = () => {
    // Replace with your Atlas API keys and project ID
    const publicKey = "jtcxwbec";
    const privateKey = "01a97a49-385e-4517-a0c7-723fbd183537";
    const projectId = "65097a8d7f27624c6c19bbc0";

    const { user, cluster } = getClient({
        publicKey,
        privateKey,
        baseUrl: "https://cloud.mongodb.com/api/atlas/v1.0",
        projectId
    });

    return { user, cluster };
};
const atlasSearch = async (query) => {
    try {
        const atlasSearchClient = getAtlasSearchClient();

        // Specify the index name
        const indexName = 'recommendedUser';

        // Perform the search using Atlas API
        const response = await atlasSearchClient.user.getAll({
            indexName,
            query,
            itemsPerPage: 10,
            envelope: true,
            pretty: true,
            httpOptions: {
                timeout: 5000,
            }
        });

        // Extract and return the search results
        const searchResults = response && response.results ? response.results : [];
        return searchResults;
    } catch (error) {
        console.error('Error performing Atlas Search:', error);
        throw error;
    }
};

const searchEngineForProfiles = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format. Please provide a valid user ID.',
            });
        }

        // Find the user by their userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';

        // Define a search query object for Atlas Search
        const atlasSearchQuery = {
            '$search': {
                'index': 'recommendedUser',
                'compound': {
                    'must': [
                        {
                            'text': {
                                'query': oppositeGender,
                                'path': 'gender',
                            },
                        },
                        {
                            'text': {
                                'query': 'User',
                                'path': 'userType',
                            },
                        },
                        // Add more search criteria as needed
                    ],
                },
            },
        };

        // Perform the Atlas Search
        const searchResults = await atlasSearch(atlasSearchQuery);
        
        // Extract user IDs of matching profiles
        const matchingUserIds = searchResults.map((result) => result._id);

        // Get the user IDs of the opposite gender
        const oppositeGenderUserIds = await User.find(
            { gender: oppositeGender, userType: 'User', _id: { $ne: userId } },
            '_id'
        ).limit(5).lean();

        return res.status(200).json({
            message: 'First 5 profiles matching the search criteria',
            matchingUserIds: matchingUserIds,
            oppositeGenderUserIds: oppositeGenderUserIds.map((doc) => doc._id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error });
    }
};

module.exports = {
    returnRecommendedProfile,
    returnRecommendedProfileWithFewCriteria,
    searchProfiles,
    searchFiveProfiles,
    searchEngineForProfiles
};