const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");
const UserIncrementId = require("../models/userIdIncrement");
const emailHandler = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signupUser = BigPromise(async (req, res, next) => {
  const user = req.decodedUser;

  const { fullName, email, password, phoneNo } = req.body;

  if (!(email && password && fullName && phoneNo)) {
    return next(
      new CustomError("Name, PhoneNo, Email and password are required!", 401)
    );
  }

  try {
    let userIncrementedId = await UserIncrementId.findOneAndUpdate(
      {
        keyId: "seqId",
      },
      { $inc: { userSequenceId: 1 } },
      { new: true }
    );
    console.log(userIncrementedId);

    if (!userIncrementedId) {
      userIncrementedId = await UserIncrementId.create({
        keyId: "seqId",
        userSequenceId: 100001,
      });
    }

    const user = await User.create({
      userUid: Number(userIncrementedId.userSequenceId),
      fullName,
      email,
      password,
      phoneNo,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("User can not be created", 401));
  }
});

// exports.signupUserWithOTP = BigPromise(async (req, res, next) => {
//   const { userId, phoneNo } = req.body;

//   if (!(userId && phoneNo)) {
//     return next(new CustomError("UserId and PhoneNo are required!", 401));
//   }

//   try {
//     const user = await User.create({
//       phoneNo,
//       googleUserId: userId,
//     });

//     return res.status(201).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return next(new CustomError("User can not be created", 401));
//   }
// });

exports.logIn = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check the presenec of email and password
  if (!(email && password)) {
    return next(new CustomError("Email and password are required!", 400));
  }

  try {
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
  } catch (error) {
    console.log(error);
    return next(new CustomError("User Login Error!", 401));
  }
});

// exports.logInWithOTP = BigPromise(async (req, res, next) => {
//   const { userId, phoneNo } = req.body;

//   // Check the presenec of email and password
//   if (!(userId && phoneNo)) {
//     return next(new CustomError("UserId and phoneNo are required!", 400));
//   }

//   try {
//     // get the user from DB
//     const user = await User.findOne({ phoneNo }).select("+googleUserId");
//     // if user is exist or not
//     if (!user) {
//       return next(new CustomError("UserId or phoneNo not matched!", 400));
//     }

//     // check the password is correct or not
//     const isCorrectGoogleUserId = await user.isGoogleUserIdValidated(userId);
//     // if password not matched
//     if (!isCorrectPassword) {
//       return next(new CustomError("UserId or phoneNo not matched!", 400));
//     }

//     const token = user.getJWTToken();
//     user.googleUserId = undefined;

//     return res.status(201).json({
//       success: true,
//       token,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return next(new CustomError("User Login Error!", 401));
//   }
// });

exports.signUserWithOTP = BigPromise(async (req, res, next) => {
  const { userId, phoneNo } = req.body;

  // Check the presense of userId and phoneNo
  if (!(userId && phoneNo)) {
    return next(new CustomError("UserId and phoneNo are required!", 400));
  }

  try {
    let userIncrementedId = await UserIncrementId.findOneAndUpdate(
      {
        keyId: "seqId",
      },
      { $inc: { userSequenceId: 1 } },
      { new: true }
    );
    console.log(userIncrementedId);

    if (!userIncrementedId) {
      userIncrementedId = await UserIncrementId.create({
        keyId: "seqId",
        userSequenceId: 100001,
      });
    }
    // get the user from DB
    let user = await User.findOne({ phoneNo }).select("+googleUserId");
    // if user is exist or not
    if (!user) {
      user = await User.create({
        userUid: Number(userIncrementedId.userSequenceId),
        phoneNo,
        googleUserId: userId,
      });
    }

    // check the password is correct or not
    const isCorrectGoogleUserId = await user.isGoogleUserIdValidated(userId);
    // if google userId not matched
    if (!isCorrectGoogleUserId) {
      return next(new CustomError("UserId or phoneNo not matched!", 400));
    }

    const token = user.getJWTToken();
    user.googleUserId = undefined;

    return res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("User Login Error!", 401));
  }
});

exports.logOut = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
  });
});

exports.resetUserPassword = BigPromise(async (req, res, next) => {
  try {
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
        new CustomError("Password and confirm password are not matched!", 400)
      );
    }

    console.log("here");

    user.password = req.body.password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    user.password = undefined;
    // Send a JSON Response or Send Token User Data

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("User password reset error Error!", 401));
  }
});

exports.forgotUserPassword = BigPromise(async (req, res, next) => {
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
  )}/api/v1/user/password/reset/${forgotToken}`;
  const message = `Hello ${user.name}, \n \n \nCopy and paste this link in your browser to reset password and hit enter \nAfter 15 minutes link will expire. \n \n ${myUrl} \n \nThank you.`;

  try {
    // sending the Email payload
    await emailHandler({
      to: user.email,
      subject: `T-Shirt Store Password Reset`,
      text: message,
    });

    return res.status(200).json({
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
  const { _id } = req.decodedUser;
  try {
    const user = await User.findById(_id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get user details!", 401));
  }
});

exports.getSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const user = await User.findById(uId);
    if (!user) {
      return next(new CustomError("User not found", 401));
    }

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get user details!", 401));
  }
});

exports.updateSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  const updateValues = {
    name: req.body?.name,
    email: req.body?.email,
    password: req.body?.password,
    phoneNo: req.body?.phoneNo,
    photo: req.body?.photo,
    vehicleId: req.body?.vehicleId,
  };

  try {
    await User.findByIdAndUpdate(uId, { ...updateValues })
      .then(() => {
        return res.status(201).json({
          success: true,
          user: updateValues,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating user!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating user!", 401));
  }
});

exports.allUsers = BigPromise(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log(error);
    return next(new CustomError("No User Found", 401));
  }
});
exports.deleteSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await User.findByIdAndRemove(uId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting user!", 401));
  }
});