
const tokenService = require('@services/token.service.js');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  const payload = tokenService.verifyAccessToken(token);

  if (!payload) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
  req.user = { userId: payload.userId,role:payload.role };
  next();
};

module.exports = authenticateToken;
