require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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

//** Log Generate API Start **//
const userLogRouter = require('./routes/userLog');
app.use('/api/user-log', userLogRouter);
//** Log Generate API End **//


// Your API endpoint for user registration (as provided earlier)
const registrationRouter = require('./routes/registration');
app.use('/api/register', registrationRouter);
/* Registration Send API End */

//** Lifestyle Add API Start **/
const lifeStyleUpdate = require('./routes/lifestyleRoutes');
app.use('/api/user-lifestyle', lifeStyleUpdate);
//** Lifestyle Add API End **/

//** Religious BG Add API Start **/
const religiousBackgroundRoutes = require('./routes/religiousBackgroundRoutes');
app.use('/api/user-religious-bg', religiousBackgroundRoutes);
//** Religious BG Add API End **/


// ** Family Info Add API Start ** //
const familyRoutes = require('./routes/familyRoutes');
app.use('/api/user-family-info', familyRoutes);
// ** Family Info Add API End ** //

//** Career and Educational Info Add API Start **//
const eduCareerRoute = require('./routes/educationCareerRoutes.js');
app.use('/api/user-education-career-info', eduCareerRoute);
//** Career and Educational Info Add API End **//


 //** Basic Info Add API Start **//
 const basicInfoRoutes = require('./routes/basicInfoRoutes');
 app.use('/api/user-basic-info', basicInfoRoutes);
 //** Basic Info Add API ENd **//


//** API to add about yourself start **//
const aboutYourselfRoutes = require('./routes/aboutYourselfRoutes');
app.use('/api/user-about-yourself', aboutYourselfRoutes);
//** API to add about yourself end **//


/****** Mobile OTP Send API Start *********/
const SendMobOTP = require('./routes/sendMobOTPRoutes');
app.use('/api/send-mob-otp', SendMobOTP);
/****** Mobile OTP Send API End *********/


// ** Mobile OTP Verification Start ** //
const verifyOTP = require('./routes/verifyOTPRoutes');
app.use('/api/verify-mob-otp', verifyOTP);
// ** Mobile OTP Verification End ** //

/****** Email Send API Start *********/
const emailOTP = require('./routes/sendEmailOTPRoutes');
app.use('/api/send-email-otp', emailOTP);
/****** Email Send API End *********/


// ** Email OTP Verification Start ** //
const verifyMailOTP = require('./routes/verifyMailOTPRoutes');
app.use('/api/verify-mail-otp', verifyMailOTP);
// ** Email OTP Verification End ** //

const loginRouter = require('./routes/loginAuthRoutes');
app.use('/api/login/returnLogin', loginRouter);

//** Login Via Mobile API Start **//
const logViaMob = require('./routes/loginViaMobRoutes');
app.use('/api/login-via-mob', logViaMob);
/* Login API ENd */

/* Login API Start */
const loginRoutes = require('./routes/loginAuthRoutes');
app.use('/api/login', loginRoutes);
/* Login API ENd */

// ** Update User Status to Active and Return Session Start ** //
const statusUpdateRoutes = require('./routes/statusUpdateRoutes');
app.use('/api/status-update', statusUpdateRoutes);
// ** Update User Status to Active and Return Session End ** //


// API to Add Basic Preferences Start
const preferences = require('./routes/preferenceRoutes'); // Import the combined route for both basic and community preferences
app.use('/api/preferences', preferences); // Use a single route for both types
// API to Add Basic Preferences ENd

// API to Return User Data
const userData = require('./routes/userDataRoutes'); // Import the combined route for both basic and community preferences
app.use('/api/user-data', userData); // Use a single route for both types
// API to Return User Data ENd

const recommendedData = require('./routes/recommendedProfile'); 
app.use('/api/recommendedData', recommendedData);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});