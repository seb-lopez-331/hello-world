require('dotenv').config();

const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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

    // Create the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,  // You can add any other fields you want for the user
    });

    // Save the user to the database
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,  // Ensure you have a JWT_SECRET in your .env file
      { expiresIn: '1h' }      // Token expires in 1 hour
    );

    // Send the response with the token
    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })
    .json({ message: 'Login successful' });
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
