const { verifyOTP } = require('../utils/main'); // Import the verifyOTP function
const { generateJwtToken } = require('../utils/auth'); // Import the JWT token generation function
const User = require('../model/user'); // Import your User model

// Controller function for mobile login
const loginViaMobile = async (req, res) => {
  const { mobile, otp } = req.body;
  const phone = mobile;
  try {
    // Find the user by mobile
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ status: 'false', message: 'Oops user not found, Register yourself' });
    }

    // Check if the user's account is active and mobile is verified
    if (user.status !== 'active' || !user.mobileVerified || !user.emailVerified) {
      return res.status(403).json({ status: 'false', message: 'Account is not active or mobile is not verified' });
    }

    // Verify Mobile and OTP
    if (verifyOTP(mobile, otp)) {
      // You can generate a JWT token here and send it as part of the response
      // This token can be used to authenticate the user for future requests
      // Example of generating a JWT token:
      const token = generateJwtToken(user);

      return res.json({ success: true, status: 'true', message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, password: user.password, userType: user.userType  } });
    } else {
      return res.status(401).json({ success: false, status: 'false', message: 'Wrong OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, status: 'false', message: 'Server error' });
  }
};

module.exports = {
  loginViaMobile,
};
