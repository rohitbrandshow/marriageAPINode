const { generateJwtToken } = require('../utils/auth');
const User = require('../model/user');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches the hashed password
    if (bcrypt.compareSync(password, user.password)) {
      // You can generate a JWT token here
      const token = generateJwtToken(user);

      // Include user details in the response
      return res.json({ success: true, status: 'true', message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, password: user.password, userType: user.userType  } });
    } else {
      return res.status(401).json({ success: false, status: 'false', message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, status: 'false', message: 'Server error' });
  }
};

const loginReturn = async (req, res) => {
  const { email, phone } = req.body;

  try {
    // Find the user by email and phone
    const user = await User.findOne({ email, phone });

    if (!user) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    // Check if the provided password matches the hashed password
    const token = generateJwtToken(user);

    // Include user details in the response
    return res.json({ success: true, status: 'true', message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, userType: user.userType } });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, status: 'false', message: 'Login failed' });
  }
};

module.exports = {
  login,
  loginReturn
};
