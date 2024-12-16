
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY = '7d';  
const REFRESH_TOKEN_EXPIRY = '7d';  

const tokenService = {
  generateTokens(userId,role) {
    const accessToken = jwt.sign({ userId,role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId,role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    
    return { accessToken, refreshToken };
  },

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  },

  refreshAccessToken(refreshToken) {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) return null;

    const accessToken = jwt.sign({ userId: payload.userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return accessToken;
  }
};

module.exports = tokenService;
