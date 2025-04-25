require('dotenv').config();

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cookie = require('cookie');

const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

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
    subject: 'Superior Budget App | Please confirm your email',
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
};

const sendChangePasswordEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT;
  const confirmUrl = `${clientUrl}/reset-password?token=${token}`;

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
    subject: 'Superior Budget App | Please change your password',
    html: `
      <p>We received a request to change your password. If this request was not initiated by you, please disregard this email. Otherwise, click the following link to change your password:</p>
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
};

// Registration function to create a new user
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: `"${email}" is not a valid email.` });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: `Username "${username}" already in use.` });
    }

    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `Email "${email}" already in use.` });
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
  await user.save();

  res.send('Email confirmed successfully');
}

exports.confirmPasswordResetToken = async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    emailConfirmationToken: hashedToken,
    emailConfirmationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send('Token is invalid or expired');
  }

  res.send('Token confirmed successfully');
}

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailConfirmationToken: hashedToken,
    emailConfirmationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send('Token is invalid or expired');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.emailConfirmationToken = undefined;
  user.emailConfirmationExpires = undefined;
  user.password = hashedPassword;
  await user.save();

  res.send('Password reset successfully');
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  await RefreshToken.deleteOne({ id: user._id });
  await new RefreshToken({
    token: refreshToken,
    id: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }).save();

  // Send token in cookie
  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ message: 'Login successful' });
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ refreshToken })
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
    });

    res.clearCookie('accessToken',{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error during logout' });
  }
};

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
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Add an email confirmation token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour from now

    // Unconfirm the user
    user.emailConfirmationToken = hashedToken;
    user.emailConfirmationExpires = tokenExpires;
    await user.save();

    // Send confirmation email with the token
    sendChangePasswordEmail(email, rawToken)
    .then(() => {
      res.status(200).send('We received a request to reset your password. Please check your email for further instructions.');
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
      res.status(500).send('Error sending password reset email.');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

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