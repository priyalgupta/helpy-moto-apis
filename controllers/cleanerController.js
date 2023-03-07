const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Cleaner = require("../models/cleaner");

exports.signupCleaner = BigPromise(async (req, res, next) => {
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
    const cleaner = await Cleaner.create({
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

exports.loginCleaner = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check the presenec of email and password
  if (!(email && password)) {
    return next(new CustomError("Email and password are required!", 400));
  }

  // get the user from DB
  const cleaner = await Cleaner.findOne({ email: email }).select("+password");
  // if user is exist or not
  if (!cleaner) {
    return next(new CustomError("Email or Password not matched!", 400));
  } else if (driver.accountDisable) {
    return next(
      new CustomError("Cleaner account is temporarily disabled", 401)
    );
  }

  // check the password is correct or not
  const isCorrectPassword = await Driver.isPasswordValidated(password);
  // if password not matched
  if (!isCorrectPassword) {
    return next(new CustomError("Email or Password not matched!", 400));
  }

  const token = driver.getJWTToken();
  cleaner.password = undefined;

  return res.status(201).json({
    success: true,
    token,
    cleaner,
  });
});

exports.logoutCleaner = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encrypToken = crypto.createHash("sha256").update(token).digest("hex");

  const cleaner = await Cleaner.findOne({
    forgotPasswordToken: encrypToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!cleaner) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password are not matched!", 400)
    );
  }

  cleaner.password = req.body.password;

  cleaner.forgotPasswordToken = undefined;
  cleaner.forgotPasswordExpiry = undefined;
  await cleaner.save();

  // Send a JSON Response or Send Token User Data
  cookieToken(user, res);
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const cleaner = await Cleaner.findOne({ email });

  // Check the user if exist or not
  if (!cleaner) {
    return next(new CustomError("Email is not registered...!", 400));
  }

  // generate the tokenData for reset password params
  const forgotToken = cleaner.getForgotPasswordToken();

  // Save the user data
  await cleaner.save({ validateBeforeSave: false }); // Without validating the data before save in DB

  // crafting the complete email message body
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `Hello ${cleaner.name}, \n \n \n Copy and paste this link in your browser to reset password and hit enter \n \n ${myUrl}`;

  try {
    // sending the Email payload
    await emailHandler({
      to: cleaner.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    // Clear the token and Expiry
    cleaner.forgotPasswordToken = undefined;
    cleaner.forgotPasswordExpiry = undefined;
    await cleaner.save({ validateBeforeSave: false }); // Without validating the data before save in DB
    return next(new CustomError(err.message, 500));
  }
});

exports.getSingleCleaner = BigPromise(async (req, res, next) => {
  const cleanerId = req.params.id;

  const cleaner = await Cleaner.findById(cleanerId);
  if (!cleaner) {
    return next(new CustomError("Cleaner not found", 401));
  }

  res.status(201).json({
    success: true,
    driver,
  });
});

exports.getAllCleaner = BigPromise(async (req, res, next) => {
  const cleaner = await Cleaner.find({});
  if (!cleaner) {
    return next(new CustomError("No Cleaner Found", 401));
  } else if (cleaner < 1) {
    return next(new CustomError("Cleaner list is empty", 400));
  }

  res.status(201).json({
    success: true,
    cleaner,
  });
});

exports.updateSingleCleaner = BigPromise(async (req, res, next) => {
  const cleanerId = req.params.id;
  const cleaner = await Cleaner.findById(cleanerId);

  if (!cleaner) {
    return next(new CustomError("No Cleaner Found", 401));
  }

  updatedCleaner = await Cleaner.findByIdAndUpdate(driverId, {
    ...req.body,
  });

  res.status(201).json({
    success: true,
    cleaner: updatedCleaner,
  });
});

exports.deleteSingleCleaner = BigPromise(async (req, res, next) => {
  const cleanerId = req.params.id;
  await Cleaner.findByIdAndRemove(cleanerId);

  res.status(201).json({
    success: true,
  });
});
