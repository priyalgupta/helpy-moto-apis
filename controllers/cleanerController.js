const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Cleaner = require("../models/cleaner");

exports.signupCleaner = BigPromise(async (req, res, next) => {
  // const user = req.decodedUser;
  const { firstName, lastName, fullName, email, password, phoneNo } = req.body;

  if (!(email && password && firstName && lastName && fullName && phoneNo)) {
    return next(
      new CustomError("Name, PhoneNo, Email and password are required!", 401)
    );
  }

  try {
    const cleaner = await Cleaner.create({
      firstName,
      lastName,
      fullName,
      email,
      password,
      phoneNo,
      photo: req.body?.photo,
      shopName: req.body?.shopName,
      shopPic: req.body?.shopPic,
      shopDesc: req.body?.shopDesc,
      workers: req.body?.workers,
      rating: req.body?.rating,
      location: req.body?.location,
    });

    return res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Cleaner can not be created", 401));
  }
});

exports.signupCleanerWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 401));
  }

  try {
    const cleaner = await Cleaner.create({
      phoneNo,
      googleUserId: userId,
    });

    return res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Cleaner can not be created", 401));
  }
});

exports.loginCleaner = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check the presenec of email and password
  if (!(email && password)) {
    return next(new CustomError("Email and password are required!", 400));
  }

  try {
    // get the user from DB
    const cleaner = await Cleaner.findOne({ email: email }).select("+password");
    // if user is exist or not
    if (!cleaner) {
      return next(new CustomError("Email or Password not matched!", 400));
    }

    // check the password is correct or not
    const isCorrectPassword = await cleaner.isPasswordValidated(password);
    // if password not matched
    if (!isCorrectPassword) {
      return next(new CustomError("Email or Password not matched!", 400));
    }

    const token = cleaner.getJWTToken();
    cleaner.password = undefined;

    return res.status(201).json({
      success: true,
      token,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Cleaner Login Error!", 401));
  }
});

exports.loginCleanerWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // Check the presenec of email and password
  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 400));
  }

  try {
    // get the user from DB
    const cleaner = await Cleaner.findOne({ phoneNo }).select("+googleUserId");
    // if user is exist or not
    if (!cleaner) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    // check the password is correct or not
    const isCorrectPassword = await cleaner.isGoogleUserIdValidated(userId);
    // if password not matched
    if (!isCorrectPassword) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    const token = cleaner.getJWTToken();
    cleaner.googleUserId = undefined;

    return res.status(201).json({
      success: true,
      token,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Cleaner Login Error!", 401));
  }
});

exports.signCleanerWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // TODO: Check the user if exists and if not create user and send the token
});

exports.logoutCleaner = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetCleanerPassword = BigPromise(async (req, res, next) => {
  try {
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

    console.log("here");

    cleaner.password = req.body.password;

    cleaner.forgotPasswordToken = undefined;
    cleaner.forgotPasswordExpiry = undefined;
    await cleaner.save();

    cleaner.password = undefined;
    // Send a JSON Response or Send Token User Data

    return res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Cleaner password reset error Error!", 401));
  }
});

exports.forgotCleanerPassword = BigPromise(async (req, res, next) => {
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
  )}/api/v1/cleaner/password/reset/${forgotToken}`;
  const message = `Hello ${cleaner.name}, \n \n \nCopy and paste this link in your browser to reset password and hit enter \nAfter 15 minutes link will expire. \n \n ${myUrl} \n \nThank you.`;

  try {
    // sending the Email payload
    await emailHandler({
      to: cleaner.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    return res.status(200).json({
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

exports.getLoggedinCleanerDetails = BigPromise(async (req, res, next) => {
  const { _id } = req.decodedUser;
  try {
    const cleaner = await Cleaner.findById(_id);
    res.status(200).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get cleaner details!", 401));
  }
});

exports.getSingleCleaner = BigPromise(async (req, res, next) => {
  const cleanerId = req.params.id;

  try {
    const cleaner = await Cleaner.findById(cleanerId);
    if (!cleaner) {
      return next(new CustomError("Cleaner not found", 401));
    }

    res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get cleaner details!", 401));
  }
});

exports.getAllCleaners = BigPromise(async (req, res, next) => {
  const cleaner = await Cleaner.find({});
  if (!cleaner) {
    return next(new CustomError("No cleaner Found", 401));
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
  const updateValues = {
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
    fullName: req.body?.fullName,
    email: req.body?.email,
    password: req.body?.password,
    phoneNo: req.body?.phoneNo,
    photo: req.body?.photo,
    shopName: req.body?.shopName,
    shopPic: req.body?.shopPic,
    shopDesc: req.body?.shopDesc,
    workers: req.body?.workers,
    rating: req.body?.rating,
    location: req.body?.location,
  };

  try {
    await Cleaner.findByIdAndUpdate(cleanerId, { ...updateValues })
      .then(() => {
        return res.status(201).json({
          success: true,
          cleaner: updateValues,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating cleaner!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating cleaner!", 401));
  }
});

exports.deleteSingleCleaner = BigPromise(async (req, res, next) => {
  const cleanerId = req.params.id;
  try {
    await Cleaner.findByIdAndRemove(cleanerId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting cleaner!", 401));
  }
});
