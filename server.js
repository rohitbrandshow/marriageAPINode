require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating verification code
const cors = require('cors');
const nodemailer = require('nodemailer');
const { generateJwtToken } = require('./auth'); // Adjust the path as needed


const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using environment variable for connection string
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});



/* Registration Send API Start */
const User = require('./model/user'); // Import your User model from user.js

// Your API endpoint for user registration (as provided earlier)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, dob, gender, password } = req.body;

    // Check if any required fields are missing
    if (!name || !email || !phone || !dob || !gender || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const saltRounds = 10; // Number of salt rounds for hashing

    // Hash the password with the specified number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique verification code (you can customize this as needed)
    const verificationCode = crypto.randomBytes(4).toString('hex');

    // Check if the email is already registered and verified
    let existingVerifiedEmail = await User.findOne({ email, emailVerified: true });
    if (existingVerifiedEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if the phone number is already registered and verified
    let existingVerifiedPhone = await User.findOne({ phone, mobileVerified: true });
    if (existingVerifiedPhone) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }

    // Check if the email is already registered and not verified
    let existingUnverifiedEmail = await User.findOne({ email, emailVerified: false });
    if (existingUnverifiedEmail) {
      // Update the existing unverified user's information
      existingUnverifiedEmail.name = name;
      existingUnverifiedEmail.dob = dob;
      existingUnverifiedEmail.gender = gender;
      existingUnverifiedEmail.password = hashedPassword;

      // Check if the same phone number also exists in unverified email
      const existingUnverifiedPhone = await User.findOne({ phone: existingUnverifiedEmail.phone });
      if (existingUnverifiedPhone) {
        existingUnverifiedPhone.name = name;
        existingUnverifiedPhone.dob = dob;
        existingUnverifiedPhone.gender = gender;
        existingUnverifiedPhone.password = hashedPassword;
        await existingUnverifiedPhone.save();
      }
      
      await existingUnverifiedEmail.save();
      return res.status(200).json({ success: true, message: 'Registration successful'});
    }

    // Check if the phone number is already registered and not verified
    let existingUnverifiedPhone = await User.findOne({ phone, mobileVerified: false });
    if (existingUnverifiedPhone) {
      // Update the existing unverified user's information
      existingUnverifiedPhone.name = name;
      existingUnverifiedPhone.dob = dob;
      existingUnverifiedPhone.gender = gender;
      existingUnverifiedPhone.password = hashedPassword;

      // Check if the same email also exists in unverified phone
      const existingUnverifiedEmail = await User.findOne({ email: existingUnverifiedPhone.email });
      if (existingUnverifiedEmail) {
        existingUnverifiedEmail.name = name;
        existingUnverifiedEmail.dob = dob;
        existingUnverifiedEmail.gender = gender;
        existingUnverifiedEmail.password = hashedPassword;
        await existingUnverifiedEmail.save();
      }

      await existingUnverifiedPhone.save();
      return res.status(200).json({ success: true, message: 'Registration successful' });
    }

    // Create a new user with the provided data and verification code
    const newUser = new User({
      name,
      email,
      phone,
      dob,
      gender,
      password: hashedPassword,
      verificationCode,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);

    // Handle specific error cases
    if (error.message.includes('validation failed')) {
      return res.status(400).json({ error: 'Invalid input data', details: error.message });
    }

    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});
/* Registration Send API End */


/* Email Send API Start */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'rohisrma@gmail.com',
    pass: 'Brandshow@123',
  },
});

// API endpoint for sending emails
app.post('/api/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'rohisrma@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Email sent successfully!' });
    }
  });
});
/* Email Send API End */


/* Login API Start */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user's account is active and email is verified
    if (user.status !== 'active' || !user.emailVerified) {
      return res.status(403).json({ message: 'Account is not active or email is not verified' });
    }

    // Check if the provided password matches the hashed password
    if (bcrypt.compareSync(password, user.password)) {
      // You can generate a JWT token here and send it as part of the response
      // This token can be used to authenticate the user for future requests
      // Example of generating a JWT token:
      const token = generateJwtToken(user);

      return res.json({ status: 'true', message: 'Login successful', token });
    } else {
      return res.status(401).json({ status: 'false', message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'false', message: 'Server error' });
  }
});

/* Login API ENd */

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
