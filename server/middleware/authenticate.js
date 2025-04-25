const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

module.exports = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // If we do not have an access token, return a 401
  if (!accessToken) {
    console.log("no access token provided, won't authenticate");
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!refreshToken) {
    console.log("no refresh token provided, will authenticate with existing access token");
    const decodedAccessToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedAccessToken;
    return next();
  }

  // Verify existing refresh token cookie
  const decodedRefreshToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  // Check the DB to see if the refresh token is the same. If not, then let's delete the cookie.
  const refreshTokenInDB = await RefreshToken.findOne({ token: refreshToken });
  if (!refreshTokenInDB) {
    res.clearCookie('refreshToken');
    const decodedAccessToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedAccessToken;
    return next();
  }

  // Refresh the access token
  const newAccessToken = jwt.sign(
    { id: decodedRefreshToken.id, username: decodedRefreshToken.username }, // match payload
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
  console.log("got a new access token");
  return next();
};
