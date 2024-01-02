const bcrypt = require("bcrypt");

const hashPassword = async (plainTextPassword) =>
  await bcrypt.hash(plainTextPassword, 10);

const validatePassword = async (plainTextPassword, passwordHash) =>
  await bcrypt.compare(plainTextPassword, passwordHash);

module.exports = {
  hashPassword,
  validatePassword,
};