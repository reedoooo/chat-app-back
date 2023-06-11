const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

module.exports = (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user to the request object
    req.user = decoded;

    // Check if the user is authorized based on the room ID
    if (req.body.roomId === '1') {
      // Check if the user has the necessary role or any other condition
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
