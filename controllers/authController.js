const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const generateAuthToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.register = async (req, res) => {
  // Same as before
};

exports.login = async (req, res) => {
  // Same as before
};
