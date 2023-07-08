// utils.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.SECRET;

const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createToken = (payload) => {
  return jwt.sign(payload, SECRET);
};

module.exports = {
  validatePassword,
  createToken,
};
