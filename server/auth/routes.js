const express = require('express');
const router = express.Router();
const authController = require('./controller');
const authenticate = require('../middleware/authenticate');

// GET request for user profile
router.get('/profile', authenticate, authController.getProfile);

// POST request to login
router.post('/login', authController.login);

// POST request to register
router.post('/register', authController.register);

// POST request to verify email
router.post('/confirm-email/:token', authController.confirmEmail);

// POST request to verify password reset token
router.post('/confirm-password-reset-token/:token', authController.confirmPasswordResetToken);

// POST request to reset password
router.post('/reset-password', authController.resetPassword);

// POST request if user forgot password
router.post('/forgot-password', authController.forgotPassword);

// DELETE route to remove user
router.delete('/delete', authenticate, authController.deleteUser);

module.exports = router;
