// middleware/logRoute.js

const logRoute = (req, res, next) => {
  console.log(`Accessed route: ${req.method} - ${req.path}`);
  next();
};

module.exports = logRoute;
