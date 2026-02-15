const { verifyAccessToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ message: "No token provided" });

  const token = header.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: "Access token invalid or expired" });
  }
}

module.exports = authMiddleware;
