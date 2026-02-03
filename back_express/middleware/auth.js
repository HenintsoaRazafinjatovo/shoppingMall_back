const extractToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    req.token = token;
  }
  
  next();
};

module.exports = { extractToken };