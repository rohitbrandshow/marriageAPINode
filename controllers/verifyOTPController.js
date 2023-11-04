const fetch = require('node-fetch');
const User = require('../model/user');
const { msg91ApiKey, msg91TemplateId } = require('../config'); // Import your API key and template ID

const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(400).json({ success: false, status: 'failed', message: 'Mobile not found in the database.' });
    }

    // Validate mobile number and OTP
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, status: 'failed', message: 'Invalid mobile number or OTP' });
    }
    

    const mobileWithCode = '91' + mobile;
    const url = `https://control.msg91.com/api/v5/otp/verify?template_id=${msg91TemplateId}&otp=${otp}&mobile=${mobileWithCode}`;
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authkey': msg91ApiKey
      },
      body: JSON.stringify({ Param1: 'value1', Param2: 'value2', Param3: 'value3' })
    };

    const response = await fetch(url, options);
    const json = await response.json();

    if (json.type === 'success') {
      user.mobileVerified = true;
      await user.save();

      return res.status(200).json({ success: true, status: 'success', message: 'OTP verified successfully' });
    } else {
      return res.status(500).json({ success: false, status: 'failed', message: 'OTP verification failed' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, status: 'failed', message: 'Server error' });
  }
};

module.exports = {
  verifyOTP,
};
