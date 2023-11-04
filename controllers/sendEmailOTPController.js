const mandrill = require('mandrill-api/mandrill');
const mandrillApiKey = require('../config').mandrillApiKey;
const User = require('../model/user');

const sendEmailOTP = async (req, res) => {
  try {
    const {
      recipientEmail,
      recipientName,
    } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: recipientEmail });

    if (!user) {
      return res.status(400).json({ status: 'failed', message: 'Email not found in the database.' });
    }

    // If a user with the email is found, retrieve the verification code
    const verificationCode = user.verificationCode;

    // Prepare the merge_vars for dynamic content
    const mergeVars = [
      {
        rcpt: recipientEmail,
        vars: [
          { name: 'CODE', content: verificationCode },
          { name: 'PASSWORD', content: user.password }, // Assuming user has a password field
          // Add more merge tags and their corresponding values as needed
        ],
      },
      // Add more recipients and their merge_vars as needed
    ];

    // Prepare the message data
    const message = {
      html: '',
      subject: 'Registration Confirmation OTP for VivahSathi',
      from_email: 'info@aapkikismat.com', // Replace with your email address
      from_name: 'VivahSathi',
      to: [
        {
          email: recipientEmail,
          name: recipientName,
          type: 'to',
        },
      ],
      merge_vars: mergeVars,
    };

    // Send the email using Mandrill API (Make sure your Mandrill API client is set up correctly)
    const mandrillClient = new mandrill.Mandrill(mandrillApiKey);

    mandrillClient.messages.sendTemplate(
      {
        template_name: 'marriage-portal', // Replace with your template name
        template_content: [],
        message: message,
      }
    );

    // Send a success response
    res.status(200).json({ status: 'success', message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    // Send an error response
    res.status(500).json({ status: 'failed', error: 'Email sending failed' });
  }
};

module.exports = {
  sendEmailOTP,
};
