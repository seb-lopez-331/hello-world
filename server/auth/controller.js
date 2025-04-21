require('dotenv').config();

const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cookie = require('cookie');

const sendConfirmationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT;
  const confirmUrl = `${clientUrl}/confirm-email?token=${token}`;

  const serverEmail = process.env.SERVER_EMAIL;
  const serverEmailPassword = process.env.SERVER_EMAIL_APP_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: serverEmail,
      pass: serverEmailPassword,
    },
  });

  const mailOptions = {
    from: serverEmail,
    to: email,
    subject: 'Please confirm your email',
    html: `
      <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
      <a href="${confirmUrl}">Confirm Email</a>
    `,
  };

  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error:', error);
      }
      console.log('Email sent:', info.response);
    });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    throw new Error('Failed to send confirmation email');
  }
}

// Registration function to create a new user
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 rounds of hashing

    // Add an email confirmation token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour from now

    // Create the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      emailConfirmationToken: hashedToken,
      emailConfirmationExpires: tokenExpires,
    });

    // Save the user to the database
    await newUser.save();

    // Send confirmation email with the token
    sendConfirmationEmail(email, rawToken)
    .then(() => {
      res.status(200).send('Registration successful! Please check your email to confirm.');
    })
    .catch((error) => {
      console.error('Error sending confirmation email:', error);
      res.status(500).send('Error sending confirmation email.');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    emailConfirmationToken: hashedToken,
    emailConfirmationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send('Token is invalid or expired');
  }

  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;
  user.emailConfirmationExpires = undefined;
  console.log('do we even go here?')
  await user.save();

  res.send('Email confirmed successfully');
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Send token in cookie
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
    })
    .json({ message: 'Login successful' });
};

exports.getSession = async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      authenticated: true,
      user: { id: decoded.sub, email: decoded.email }, // Customize this
    });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('connectedAccounts').populate('alerts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // userId comes from JWT (set in auth middleware)

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};