const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Mechanic = require("../models/mechanic");

exports.signupMechanic = BigPromise(async (req, res, next) => {
  const { firstName, lastName, fullName, email, password, phoneNo } = req.body;

  if (!(email && password && firstName && lastName && fullName && phoneNo)) {
    return next(
      new CustomError("Name, PhoneNo, Email and password are required!", 401)
    );
  }

  try {
    const mechanic = await Mechanic.create({
      firstName,
      lastName,
      fullName,
      photo: req.body?.photo,
      email,
      password,
      phoneNo,
      shopName: req.body?.shopName,
      shopPic: req.body?.shopPic,
      shopDesc: req.body?.shopDesc,
      workers: req.body?.workers,
      rating: req.body?.rating,
      location: req.body?.location,
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

exports.signupMechanicWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId, phoneNo are required!", 401));
  }

  try {
    const mechanic = await Mechanic.create({
      phoneNo,
      googleUserId: userId,
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

  try {
    // get the user from DB
    const mechanic = await Mechanic.findOne({ email: email }).select(
      "+password"
    );
    // if user is exist or not
    if (!mechanic) {
      return next(new CustomError("Email or Password not matched!", 400));
    }

    // check the password is correct or not
    const isCorrectPassword = await mechanic.isPasswordValidated(password);
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
  } catch (error) {
    console.log(error);
    return next(new CustomError("Mechanic Login Error!", 401));
  }
});

exports.loginMechanicWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // Check the presenec of email and password
  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 400));
  }

  try {
    // get the user from DB
    const mechanic = await Mechanic.findOne({ phoneNo }).select(
      "+googleUserId"
    );
    // if user is exist or not
    if (!mechanic) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    // check the password is correct or not
    const isCorrectPassword = await mechanic.isGoogleUserIdValidated(userId);
    // if password not matched
    if (!isCorrectPassword) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    const token = mechanic.getJWTToken();
    mechanic.googleUserId = undefined;

    return res.status(201).json({
      success: true,
      token,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Mechanic Login Error!", 401));
  }
});

exports.signMechanicWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // TODO: Check the user if exists and if not create user and send the token
  // Check the presense of userId and phoneNo
  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 400));
  }

  try {
    // get the user from DB
    let mechanic = await mechanic.findOne({ phoneNo }).select("+googleUserId");
    // if user is exist or not
    if (!mechanic) {
      mechanic = await mechanic.create({
        phoneNo,
        googleUserId: userId,
      });
    }

    // check the password is correct or not
    const isCorrectGoogleUserId = await mechanic.isGoogleUserIdValidated(
      userId
    );
    // if google userId not matched
    if (!isCorrectGoogleUserId) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    const token = mechanic.getJWTToken();
    mechanic.googleUserId = undefined;

    return res.status(201).json({
      success: true,
      token,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("User Login Error!", 401));
  }
});

exports.logoutMechanic = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetMechanicPassword = BigPromise(async (req, res, next) => {
  try {
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

    console.log("here");

    mechanic.password = req.body.password;

    mechanic.forgotPasswordToken = undefined;
    mechanic.forgotPasswordExpiry = undefined;
    await mechanic.save();

    mechanic.password = undefined;
    // Send a JSON Response or Send Token User Data

    return res.status(201).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Mechanic password reset error Error!", 401));
  }
});

exports.forgotMechanicPassword = BigPromise(async (req, res, next) => {
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
  )}/api/v1/mechanic/password/reset/${forgotToken}`;
  const message = `Hello ${mechanic.name}, \n \n \nCopy and paste this link in your browser to reset password and hit enter \nAfter 15 minutes link will expire. \n \n ${myUrl} \n \nThank you.`;

  try {
    // sending the Email payload
    await emailHandler({
      to: mechanic.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    return res.status(200).json({
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

exports.getLoggedinMechanicDetails = BigPromise(async (req, res, next) => {
  const { _id } = req.decodedUser;
  try {
    const mechanic = await Mechanic.findById(_id);
    res.status(200).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get mechanic details!", 401));
  }
});

exports.getSingleMechanic = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;

  try {
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      return next(new CustomError("Mechanic not found", 401));
    }

    res.status(201).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get mechanic details!", 401));
  }
});

exports.getAllMechanics = BigPromise(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get list of mechanic details!", 401));
  }
});

exports.updateSingleMechanic = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;

  const updateValues = {
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
    fullName: req.body?.fullName,
    photo: req.body?.photo,
    email: req.body?.email,
    password: req.body?.password,
    phoneNo: req.body?.phoneNo,
    shopName: req.body?.shopName,
    shopPic: req.body?.shopPic,
    shopDesc: req.body?.shopDesc,
    workers: req.body?.workers,
    rating: req.body?.rating,
    location: req.body?.location,
  };

  try {
    await Mechanic.findByIdAndUpdate(mechanicId, { ...updateValues })
      .then(() => {
        return res.status(201).json({
          success: true,
          mechanic: updateValues,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating mechanic!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating mechanic!", 401));
  }
});

exports.deleteSingleMechanic = BigPromise(async (req, res, next) => {
  const mechanicId = req.params.id;
  try {
    await Mechanic.findByIdAndRemove(mechanicId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting mechanic!", 401));
  }
});
