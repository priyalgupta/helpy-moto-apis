const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Mechanic = require("../models/mechanic");

exports.signupMechanic = BigPromise(async (req, res, next) => {
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
    const mechanic = await Mechanic.create({
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
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Mechanic can not be created", 401));
  }
});

exports.loginMechanic = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check the presenec of email and password
  if (!(email && password)) {
    return next(new CustomError("Email and password are required!", 400));
  }

  // get the user from DB
  const mechanic = await Mechanic.findOne({ email: email }).select("+password");
  // if user is exist or not
  if (!mechanic) {
    return next(new CustomError("Email or Password not matched!", 400));
  } else if (mechanic.accountDisable) {
    return next(
      new CustomError("Mechanic account is temporarily disabled", 401)
    );
  }

  // check the password is correct or not
  const isCorrectPassword = await Mechanic.isPasswordValidated(password);
  // if password not matched
  if (!isCorrectPassword) {
    return next(new CustomError("Email or Password not matched!", 400));
  }

  const token = mechanic.getJWTToken();
  mechanic.password = undefined;

  return res.status(201).json({
    success: true,
    token,
    mechanic,
  });
});

exports.logoutMechanic = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encrypToken = crypto.createHash("sha256").update(token).digest("hex");

  const mechanic = await Mechanic.findOne({
    forgotPasswordToken: encrypToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!mechanic) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password are not matched!", 400)
    );
  }

  mechanic.password = req.body.password;

  mechanic.forgotPasswordToken = undefined;
  mechanic.forgotPasswordExpiry = undefined;
  await mechanic.save();

  // Send a JSON Response or Send Token User Data
  cookieToken(mechanic, res);
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const mechanic = await Mechanic.findOne({ email });

  // Check the user if exist or not
  if (!mechanic) {
    return next(new CustomError("Email is not registered...!", 400));
  }

  // generate the tokenData for reset password params
  const forgotToken = mechanic.getForgotPasswordToken();

  // Save the user data
  await mechanic.save({ validateBeforeSave: false }); // Without validating the data before save in DB

  // crafting the complete email message body
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `Hello ${mechanic.name}, \n \n \n Copy and paste this link in your browser to reset password and hit enter \n \n ${myUrl}`;

  try {
    // sending the Email payload
    await emailHandler({
      to: mechanic.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    // Clear the token and Expiry
    mechanic.forgotPasswordToken = undefined;
    mechanic.forgotPasswordExpiry = undefined;
    await mechanic.save({ validateBeforeSave: false }); // Without validating the data before save in DB
    return next(new CustomError(err.message, 500));
  }
});

exports.getSingleMechanic = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;

  const mechanic = await Mechanic.findById(mechanicId);
  if (!mechanic) {
    return next(new CustomError("Mechanic not found", 401));
  }

  res.status(201).json({
    success: true,
    mechanic,
  });
});

exports.getAllMechanics = BigPromise(async (req, res, next) => {
  const mechanic = await Mechanic.find({});
  if (!mechanic) {
    return next(new CustomError("No Mechanic Found", 401));
  } else if (mechanic < 1) {
    return next(new CustomError("Mechanic list is empty", 400));
  }

  res.status(201).json({
    success: true,
    mechanic,
  });
});

exports.updateSingleMechanic = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;
  const mechanic = await Mechanic.findById(mechanicId);

  if (!mechanic) {
    return next(new CustomError("No Mechanic Found", 401));
  }

  updatedMechanic = await Mechanic.findByIdAndUpdate(mechanicId, {
    ...req.body,
  });

  res.status(201).json({
    success: true,
    mechanic: updatedMechanic,
  });
});

exports.deleteSingleMechanic = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;
  const mechanic = await Mechanic.findByIdAndRemove(mechanicId);

  res.status(201).json({
    success: true,
  });
});
