const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Driver = require("../models/driver");

exports.signupDriver = BigPromise(async (req, res, next) => {
  const { firstName, lastName, fullName, email, password, phoneNo } = req.body;

  if (!(email && password && firstName && lastName && fullName && phoneNo)) {
    return next(
      new CustomError("Name, PhoneNo, Email and password are required!", 401)
    );
  }

  try {
    const driver = await Driver.create({
      firstName,
      lastName,
      fullName,
      email,
      password,
      phoneNo,
      photo: req.body?.photo,
      driverLicense: req.body?.driverLicense,
      licensePic: req.body?.licensePic,
      workerExperience: req.body?.workerExperience,
      rating: req.body?.rating,
      homeAddress: req.body?.homeAddress,
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

exports.signupDriverWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 401));
  }

  try {
    const driver = await Driver.create({
      phoneNo,
      googleUserId: userId,
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

  try {
    // get the user from DB
    const driver = await Driver.findOne({ email: email }).select("+password");
    // if user is exist or not
    if (!driver) {
      return next(new CustomError("Email or Password not matched!", 400));
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
  } catch (error) {
    console.log(error);
    return next(new CustomError("Driver Login Error!", 401));
  }
});

exports.loginDriverWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // Check the presenec of email and password
  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 400));
  }

  try {
    // get the user from DB
    const driver = await Driver.findOne({ phoneNo }).select("+googleUserId");
    // if user is exist or not
    if (!driver) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    // check the password is correct or not
    const isCorrectPassword = await driver.isGoogleUserIdValidated(userId);
    // if password not matched
    if (!isCorrectPassword) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    const token = driver.getJWTToken();
    driver.googleUserId = undefined;

    return res.status(201).json({
      success: true,
      token,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Driver Login Error!", 401));
  }
});

exports.signDriverWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // Check the presence of email and password
  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 400));
  }

  try {
    // get the user from DB
    let driver = await Driver.findOne({ phoneNo }).select("+googleUserId");
    // if user is exist or not
    if (!driver) {
      driver = await Driver.create({
        phoneNo,
        googleUserId: userId,
      });
    }

    // check the password is correct or not
    const isCorrectGoogleUserId = await driver.isGoogleUserIdValidated(userId);
    // if google userId not matched
    if (!isCorrectGoogleUserId) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    const token = driver.getJWTToken();
    driver.googleUserId = undefined;

    return res.status(201).json({
      success: true,
      token,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Driver Login Error!", 401));
  }
});

exports.logoutDriver = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetDriverPassword = BigPromise(async (req, res, next) => {
  try {
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

    console.log("here");

    driver.password = req.body.password;

    driver.forgotPasswordToken = undefined;
    driver.forgotPasswordExpiry = undefined;
    await driver.save();

    driver.password = undefined;
    // Send a JSON Response or Send Token User Data

    return res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Driver password reset error Error!", 401));
  }
});

exports.forgotDriverPassword = BigPromise(async (req, res, next) => {
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
  )}/api/v1/driver/password/reset/${forgotToken}`;
  const message = `Hello ${driver.name}, \n \n \nCopy and paste this link in your browser to reset password and hit enter \nAfter 15 minutes link will expire. \n \n ${myUrl} \n \nThank you.`;

  try {
    // sending the Email payload
    await emailHandler({
      to: driver.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    return res.status(200).json({
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

exports.getLoggedinDriverDetails = BigPromise(async (req, res, next) => {
  const { _id } = req.decodedUser;
  try {
    const driver = await Driver.findById(_id);
    res.status(200).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get driver details!", 401));
  }
});

exports.getSingleDriver = BigPromise(async (req, res, next) => {
  const driverId = req.params.id;

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return next(new CustomError("Driver not found", 401));
    }

    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get driver details!", 401));
  }
});

exports.getAllDriver = BigPromise(async (req, res, next) => {
  const driver = await Driver.find({});
  if (!driver) {
    return next(new CustomError("No driver Found", 401));
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

  const updateValues = {
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
    fullName: req.body?.fullName,
    email: req.body?.email,
    password: req.body?.password,
    phoneNo: req.body?.phoneNo,
    photo: req.body?.photo,
    driverLicense: req.body?.driverLicense,
    licensePic: req.body?.licensePic,
    workerExperience: req.body?.workerExperience,
    rating: req.body?.rating,
    homeAddress: req.body?.homeAddress,
  };

  try {
    await Driver.findByIdAndUpdate(driverId, { ...updateValues })
      .then(() => {
        return res.status(201).json({
          success: true,
          driver: updateValues,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating driver!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating driver!", 401));
  }
});

exports.deleteSingleDriver = BigPromise(async (req, res, next) => {
  const driverId = req.params.id;

  try {
    await Driver.findByIdAndRemove(driverId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting driver!", 401));
  }
});
