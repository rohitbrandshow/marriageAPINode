const fetch = require('node-fetch');

const { msg91ApiKey, msg91TemplateId } = require('../config'); // Import your API key and template ID

// Controller for sending mobile OTP
const createOrUpdateSendMobOTP = async (req, res) => {
  try {
     
    const { mobile } = req.body;
    
    // Validate the mobile number (you can add more robust validation)
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ status: 'failed', message: 'Invalid mobile number' });
    }

    const mobileWithCode = `91${mobile}`;
    const url = `https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=${mobileWithCode}`;
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authkey': msg91ApiKey,
      },
      body: JSON.stringify({ Param1: 'value1', Param2: 'value2', Param3: 'value3' }),
    };

    const response = await fetch(url, options);
    const json = await response.json();

    console.log(json);
    
    if (json.type === 'success') {
      return res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
    } else {
      return res.status(500).json({ status: 'failed', message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ status: 'failed', message: error.message });
  }
};

module.exports = {
  createOrUpdateSendMobOTP,
};
