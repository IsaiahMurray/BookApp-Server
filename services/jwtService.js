const JWT = require('jsonwebtoken');
const Helpers = require('./helpers');

const createSessionToken = async (userId, options) => {
  // Should expire in 20 minutes
  const now = Math.floor(Date.now() / 1000);
  return JWT.sign(
    {
      userId,
      iat: now,
      ...options
    },
    process.env.JWT_SECRET,
    {
      expiresIn: now + Helpers.time(20, 'minutes')
    }
  );
};

const verifyJWT = async token => {
  // This will attempt to validate the jwt, and return the payload if valid
  // If invalid it will return false
  try {
    return JWT.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return false;
  }
};

module.exports = {
  createSessionToken,
  verifyJWT
};
