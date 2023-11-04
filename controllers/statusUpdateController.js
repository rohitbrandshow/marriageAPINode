const { generateJwtToken } = require('../utils/auth');
const User = require('../model/user');

const updateStatus = async (req, res) => {
  const { email, mobile } = req.body;

  try {
    // Find the user by email and mobile
    const user = await User.findOne({ email, phone: mobile });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or mobile number' });
    }

    // Check if the user's account is already active
    if (user.status === 'active') {
      // If the account is already active, return a token for session handling
      const token = generateJwtToken(user);
      return res.json({ success: true, status: 'true', goto: 'login', message: 'Account is already active', token});
    }

    // Update the user's status to "active"
    user.status = 'active';
    await user.save();

    // Generate a JWT token for session handling
    const token = generateJwtToken(user);

    return res.json({ success: true, status: 'true', goto: 'dashboard', message: 'Account is now active', token,  user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, status: 'false', goto: 'nowhere', message: 'Server error' });
  }
};

module.exports = {
  updateStatus,
};
