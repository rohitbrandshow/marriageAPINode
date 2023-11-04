// Function to verify OTP using MSG91 API
async function verifyOTP(mobile, otp) {
    try {
      const msg91ApiKey = '248168A6ljwU97ogg5bf3914a';
  
      // Replace 'YOUR_TEMPLATE_ID' with your actual MSG91 template ID
      const tempIDMsg91 = '622b3873da72f5035b46a462';
  
      // Validate the mobile number and OTP (you can add more robust validation)
      if (!mobile || !/^[0-9]{12}$/.test(mobile)) {
        throw new Error('Invalid mobile number');
      }
  
      if (!otp || !/^[0-9]{4}$/.test(otp)) {
        throw new Error('Invalid OTP');
      }
  
      const url = `https://control.msg91.com/api/v5/otp/verify?template_id=${tempIDMsg91}&otp=${otp}&mobile=${mobile}`;
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
  
      return json.type === 'success';
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }
  /** Function to check otp end **/

  module.exports = {
    verifyOTP,
  };