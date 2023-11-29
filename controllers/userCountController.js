const User = require('../model/user');

const getUsersCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ userType: 'User' });
        res.status(200).json({ success: true, count: userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getUsersCount
};
