const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');

function generateJwtToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    // Add any other user-related information to the payload as needed
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });

  return token;
}

module.exports = {
  generateJwtToken,
};
