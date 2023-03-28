const Mechanic = require("../models/mechanic");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isMechanicLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.header("Authorization").replace("Bearer ", "") || req.body?.token;

  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.decodedUser = await Mechanic.findById(decoded.id);
  next();
});
