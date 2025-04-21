const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

module.exports = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Try to verify access token first
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      // If token is invalid for reasons other than expiry
      return res.status(403).json({ message: 'Invalid token' });
    }

    // At this point, access token is expired.
    // Check if we have a refresh token
    if (!refreshToken) {
      return res.status(403).json({ message: 'No refresh token provided' });
    }

    // Check if refresh token exists in DB
    const refreshTokenInDB = await RefreshToken.findOne({ token: refreshToken });
    if (!refreshTokenInDB) {
      return res.status(403).json({ message: 'Refresh token not recognized' });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Optionally: create a new refresh token here and rotate
      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id, username: decodedRefresh.username }, // match payload
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      req.user = jwt.decode(newAccessToken);
      return next();
    } catch (refreshErr) {
      return res.status(403).json({ message: 'Refresh token invalid or expired' });
    }
  }
};
