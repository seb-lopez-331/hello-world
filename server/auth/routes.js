const express = require('express');
const router = express.Router();
const authController = require('./controller');
const authenticate = require('../middleware/authenticate');

// POST request to login
router.post('/login', authController.login);

// POST request to register
router.post('/register', authController.register);

// DELETE route to remove user
router.delete('/delete', authenticate, authController.deleteUser);

module.exports = router;
