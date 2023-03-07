const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");

exports.signupUser = BigPromise(async (req, res, next) => {
  // const user = req.user;
  const { name, email, password, mobNo } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      mobNo,
      photo: req.body?.photo,
      vehicleId: req.body?.vehicleId,
      // user: user._id,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Order can not be created", 401));
  }
});

exports.logIn = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check the presenec of email and password
  if (!(email && password)) {
    return next(new CustomError("Email and password are required!", 400));
  }

  // get the user from DB
  const user = await User.findOne({ email: email }).select("+password");
  // if user is exist or not
  if (!user) {
    return next(new CustomError("Email or Password not matched!", 400));
  }

  // check the password is correct or not
  const isCorrectPassword = await user.isPasswordValidated(password);
  // if password not matched
  if (!isCorrectPassword) {
    return next(new CustomError("Email or Password not matched!", 400));
  }

  const token = user.getJWTToken();
  user.password = undefined;

  return res.status(201).json({
    success: true,
    token,
    user,
  });
});

exports.logOut = BigPromise(async (req, res, next) => {

  res.status(200).json({
      success: true,
      message: "Successfully logged out!",
  });
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encrypToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
      forgotPasswordToken: encrypToken,
      forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
      return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
      return next(
          new CustomError(
              "Password and confirm password are not matched!",
              400
          )
      );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  // Send a JSON Response or Send Token User Data
  cookieToken(user, res);
});


exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Check the user if exist or not
  if (!user) {
      return next(new CustomError("Email is not registered...!", 400));
  }

  // generate the tokenData for reset password params
  const forgotToken = user.getForgotPasswordToken();

  // Save the user data
  await user.save({ validateBeforeSave: false }); // Without validating the data before save in DB

  // crafting the complete email message body
  const myUrl = `${req.protocol}://${req.get(
      "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `Hello ${user.name}, \n \n \n Copy and paste this link in your browser to reset password and hit enter \n \n ${myUrl}`;

  try {
      // sending the Email payload
      await emailHandler({
          to: user.email,
          subject: `T-Shirt Store Password Reset`,
          text: message,
      });

      res.status(200).json({
          success: true,
          message: "Email sent successfully",
      });
  } catch (err) {
      // Clear the token and Expiry
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false }); // Without validating the data before save in DB
      return next(new CustomError(err.message, 500));
  }
});

exports.getLoggedinUserDetails = BigPromise(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.status(200).json({
      success: true,
      user,
  });
});

exports.getSingleUser = BigPromise(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new CustomError("User not found", 401));
  }

  res.status(201).json({
    success: true,
    user,
  });
});

exports.getAllUsers = BigPromise(async (req, res, next) => {
  const user = await User.find({});
  if (!user) {
    return next(new CustomError("No User Found", 401));
  } else if (user < 1) {
    return next(new CustomError("User list is empty", 400));
  }

  res.status(201).json({
    success: true,
    user,
  });
});

exports.updateSingleUser = BigPromise(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new CustomError("No User Found", 401));
  }

  const {
    name,
    email,
    password,
    mobNo,
    // user: user._id,
  } = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, {
    name,
    email,
    password,
    mobNo,
    photo: req.body?.photo,
    vehicleId: req.body?.vehicleId,
  });

  return res.status(201).json({
    success: true,
    user: updatedUser,
  });
});

exports.deleteSingleUser = BigPromise(async (req, res, next) => {
  const userId = req.params.id;

  await User.findByIdAndRemove(userId);

  res.status(201).json({
    success: true,
  });
});
