const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../model/user'); // Import your User model from the appropriate path
const mongoose = require('mongoose'); // Import Mongoose for isValidObjectId

const userRegistration = async (req, res) => {
  const { name, email, phone, gender, password, createdFrom } = req.body;

  try {
    // Check if any required fields are missing
    if (!name || !email || !phone || !gender || !password || !createdFrom) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const saltRounds = 10; // Number of salt rounds for hashing

    // Hash the password with the specified number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique verification code (you can customize this as needed)
    const verificationCode = crypto.randomBytes(4).toString('hex');

    let existingActiveUser = await User.findOne({ email, phone, status: "active" });
    if (existingActiveUser) {
      return res.status(400).json({ error: 'User Already Exist' });
    }

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
      existingUnverifiedEmail.gender = gender;
      existingUnverifiedEmail.password = hashedPassword;
      existingUnverifiedEmail.createdFrom = createdFrom;

      // Check if the same phone number also exists in unverified email
      const existingUnverifiedPhone = await User.findOne({ phone: existingUnverifiedEmail.phone });
      if (existingUnverifiedPhone) {
        existingUnverifiedPhone.name = name;
        existingUnverifiedPhone.gender = gender;
        existingUnverifiedPhone.password = hashedPassword;
        existingUnverifiedPhone.createdFrom = createdFrom;
        await existingUnverifiedPhone.save();
      }

      await existingUnverifiedEmail.save();
      return res.status(200).json({ success: true, message: 'Registration successful' });
    }

    // Check if the phone number is already registered and not verified
    let existingUnverifiedPhone = await User.findOne({ phone, mobileVerified: false });
    if (existingUnverifiedPhone) {
      // Update the existing unverified user's information
      existingUnverifiedPhone.name = name;
      existingUnverifiedPhone.gender = gender;
      existingUnverifiedPhone.password = hashedPassword;
      existingUnverifiedPhone.createdFrom = createdFrom;

      // Check if the same email also exists in unverified phone
      const existingUnverifiedEmail = await User.findOne({ email: existingUnverifiedPhone.email });
      if (existingUnverifiedEmail) {
        existingUnverifiedEmail.name = name;
        existingUnverifiedEmail.gender = gender;
        existingUnverifiedEmail.password = hashedPassword;
        existingUnverifiedEmail.createdFrom = createdFrom;
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
      gender,
      password: hashedPassword,
      verificationCode,
      createdFrom: createdFrom,
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
  
};

const userAddFromAdmin  = async (req, res) => {
  const { name, email, phone, gender, password, userId, createdFrom } = req.body;

  try {
    // Check if any required fields are missing
    if (!name || !email || !phone || !gender || !password || !createdFrom) {
      return res.status(200).json({ success: false, message: 'All fields are required' });
    }

    if (!userId) {
      return res.status(200).json({
        success: false,
        message: 'User ID is required. Please provide a valid user ID.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({
        success: false,
        message: 'Invalid user ID format. Please provide a valid user ID.',
      });
    }
    
    const query = { _id: userId };
    query.userType = 'Admin';
    const user = await User.findOne(query);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Oops You are not Admin. You cannot add new users.',
      });
    }

    const saltRounds = 10; // Number of salt rounds for hashing

    // Hash the password with the specified number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique verification code (you can customize this as needed)
    const verificationCode = crypto.randomBytes(4).toString('hex');

    let existingActiveUser = await User.findOne({ email, phone, status: "active" });
    if (existingActiveUser) {
      return res.status(200).json({ success: false, message: 'User Already Exist' });
    }

    /*
    let existingActiveUserWithEmail = await User.findOne({ email, status: "active" });
    if (existingActiveUserWithEmail) {
      return res.status(200).json({ success: false, message: 'User Already Exist' });
    }

    let existingActiveUserWithMob = await User.findOne({ phone, status: "active" });
    if (existingActiveUserWithMob) {
      return res.status(200).json({ success: false, message: 'User Already Exist' });
    }
    */

    // Check if the email is already registered and verified
    let existingVerifiedEmail = await User.findOne({ email, emailVerified: true });
    if (existingVerifiedEmail) {
      return res.status(200).json({ success: false, message: 'Email already exists' });
    }

    // Check if the phone number is already registered and verified
    let existingVerifiedPhone = await User.findOne({ phone, mobileVerified: true });
    if (existingVerifiedPhone) {
      return res.status(200).json({ success: false, message: 'Mobile number already exists' });
    }

    // Check if the email is already registered and not verified
    let existingUnverifiedEmail = await User.findOne({ email, emailVerified: false });
    if (existingUnverifiedEmail) {
      // Update the existing unverified user's information
      existingUnverifiedEmail.name = name;
      existingUnverifiedEmail.gender = gender;
      existingUnverifiedEmail.password = hashedPassword;
      existingUnverifiedEmail.status = 'active';
      existingUnverifiedEmail.createdFrom = createdFrom;

      // Check if the same phone number also exists in unverified email
      const existingUnverifiedPhone = await User.findOne({ phone: existingUnverifiedEmail.phone });
      if (existingUnverifiedPhone) {
        existingUnverifiedPhone.name = name;
        existingUnverifiedPhone.gender = gender;
        existingUnverifiedPhone.password = hashedPassword;
        existingUnverifiedPhone.status = 'active';
        existingUnverifiedPhone.createdFrom = createdFrom;
        await existingUnverifiedPhone.save();
      }

      await existingUnverifiedEmail.save();
      return res.status(200).json({ success: true, message: 'Email Already Exist Information Updated successful' });
    }

    // Check if the phone number is already registered and not verified
    let existingUnverifiedPhone = await User.findOne({ phone, mobileVerified: false });
    if (existingUnverifiedPhone) {
      // Update the existing unverified user's information
      existingUnverifiedPhone.name = name;
      existingUnverifiedPhone.gender = gender;
      existingUnverifiedPhone.password = hashedPassword;
      existingUnverifiedPhone.status = 'active';
      existingUnverifiedPhone.createdFrom = createdFrom;

      // Check if the same email also exists in unverified phone
      const existingUnverifiedEmail = await User.findOne({ email: existingUnverifiedPhone.email });
      if (existingUnverifiedEmail) {
        existingUnverifiedEmail.name = name;
        existingUnverifiedEmail.gender = gender;
        existingUnverifiedEmail.password = hashedPassword;
        existingUnverifiedEmail.status = 'active';
        existingUnverifiedEmail.createdFrom = createdFrom;
        await existingUnverifiedEmail.save();
      }

      await existingUnverifiedPhone.save();
      return res.status(200).json({ success: true, message: 'Information Updated successful' });
    }

    // Create a new user with the provided data and verification code
    const newUser = new User({
      name,
      email,
      phone,
      gender,
      password: hashedPassword,
      verificationCode,
      status: 'active',
      createdFrom: createdFrom
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);

    // Handle specific error cases
    if (error.message.includes('validation failed')) {
      return res.status(400).json({ success: false, error: 'Invalid input data', details: error.message });
    }

    res.status(500).json({ success: false, error: 'Registration failed', details: error.message });
  }
  
};


module.exports = {
  userRegistration,
  userAddFromAdmin
};
