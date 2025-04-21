const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      if (!refreshToken) {
        return res.status(403).json({ message: 'Session expired, please log in again' });
      }
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id, username: decodedRefresh.username }, // adjust based on payload
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
      });

      req.user = jwt.decode(newAccessToken);
      return next();
    } catch {
      res.status(403).json({ message: 'Refresh token invalid or expired' });
    }

    return res.status(403).json({ message: 'Invalid token' });
  }
};
