const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.header("Authorization").replace("Bearer ", "") || req.body?.token;
  console.log(token);
  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.decodedUser = await User.findById(decoded.id);
  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    console.log(req.decodedUser.role);
    if (!roles.includes(req.decodedUser.role)) {
      return next(new CustomError("You don't have the access!", 403));
    }
    next();
  };
};
