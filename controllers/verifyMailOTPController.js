const User = require('../model/user');

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success: false, status: 'failed', message: 'Email not found in the database.' });
    }

    // Check if the OTP matches the one stored in the user document
    if (user.verificationCode !== OTP) {
      return res.status(400).json({ success: false, status: 'failed', message: 'Email OTP is different.' });
    }

    // Update user's verification status or perform other relevant actions if needed
    user.emailVerified = true;
    await user.save();

    // Send a success response
    return res.status(200).json({ success: true, status: 'success', message: 'Email Verified' });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    // Send an error response
    return res.status(500).json({ success: false, status: 'failed', error: 'Email Verification failed' });
  }
};

module.exports = {
  verifyEmailOTP,
};
