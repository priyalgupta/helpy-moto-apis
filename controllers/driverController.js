const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Driver = require("../models/driver");

exports.signupDriver = BigPromise(async (req, res, next) => {
  // const user = req.user;

  const {
    ownerName,
    ownerPic,
    email,
    phoneNum,
    shopName,
    shopPic,
    shopDesc,
    workers,
    location,
    services,
    startDate,
  } = req.body;
  try {
    const driver = await Driver.create({
      ownerName,
      ownerPic,
      email,
      phoneNum,
      shopName,
      shopPic,
      shopDesc,
      workers,
      location,
      services,
      startDate,
      // user: user._id,
    });

    return res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Driver can not be created", 401));
  }
});

exports.loginDriver = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check the presenec of email and password
  if (!(email && password)) {
    return next(new CustomError("Email and password are required!", 400));
  }

  // get the user from DB
  const driver = await Driver.findOne({ email: email }).select("+password");
  // if user is exist or not
  if (!driver) {
    return next(new CustomError("Email or Password not matched!", 400));
  } else if (driver.accountDisable) {
    return next(new CustomError("Driver account is temporarily disabled", 401));
  }

  // check the password is correct or not
  const isCorrectPassword = await driver.isPasswordValidated(password);
  // if password not matched
  if (!isCorrectPassword) {
    return next(new CustomError("Email or Password not matched!", 400));
  }

  const token = driver.getJWTToken();
  driver.password = undefined;

  return res.status(201).json({
    success: true,
    token,
    driver,
  });
});

exports.logoutDriver = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encrypToken = crypto.createHash("sha256").update(token).digest("hex");

  const driver = await Driver.findOne({
    forgotPasswordToken: encrypToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!driver) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password are not matched!", 400)
    );
  }

  driver.password = req.body.password;

  driver.forgotPasswordToken = undefined;
  driver.forgotPasswordExpiry = undefined;
  await driver.save();

  // Send a JSON Response or Send Token User Data
  cookieToken(driver, res);
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const driver = await Driver.findOne({ email });

  // Check the user if exist or not
  if (!driver) {
    return next(new CustomError("Email is not registered...!", 400));
  }

  // generate the tokenData for reset password params
  const forgotToken = driver.getForgotPasswordToken();

  // Save the user data
  await driver.save({ validateBeforeSave: false }); // Without validating the data before save in DB

  // crafting the complete email message body
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `Hello ${driver.name}, \n \n \n Copy and paste this link in your browser to reset password and hit enter \n \n ${myUrl}`;

  try {
    // sending the Email payload
    await emailHandler({
      to: driver.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    // Clear the token and Expiry
    driver.forgotPasswordToken = undefined;
    driver.forgotPasswordExpiry = undefined;
    await driver.save({ validateBeforeSave: false }); // Without validating the data before save in DB
    return next(new CustomError(err.message, 500));
  }
});

exports.getSingleDriver = BigPromise(async (req, res, next) => {
  const driverId = req.params.id;

  const driver = await Driver.findById(driverId);
  if (!driver) {
    return next(new CustomError("Driver not found", 401));
  }

  res.status(201).json({
    success: true,
    driver,
  });
});

exports.getAllDriver = BigPromise(async (req, res, next) => {
  const driver = await Driver.find({});
  if (!driver) {
    return next(new CustomError("No Driver Found", 401));
  } else if (driver < 1) {
    return next(new CustomError("Driver list is empty", 400));
  }

  res.status(201).json({
    success: true,
    driver,
  });
});

exports.updateSingleDriver = BigPromise(async (req, res, next) => {
  const driverId = req.params.id;
  const driver = await Driver.findById(driverId);

  if (!driver) {
    return next(new CustomError("No Driver Found", 401));
  }

  updatedDriver = await Driver.findByIdAndUpdate(driverId, {
    ...req.body,
  });

  res.status(201).json({
    success: true,
    driver: updatedDriver,
  });
});

exports.deleteSingleDriver = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;
  await Driver.findByIdAndRemove(mechanicId);

  res.status(201).json({
    success: true,
  });
});
