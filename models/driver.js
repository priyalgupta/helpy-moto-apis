const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const drierSchema = new Schema(
  {
    driverName: {
      type: String,
      required: true,
    },
    driverPic: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
      required: true,
    },
    driverLicense: {
      type: String,
      required: true,
    },
    licensePic: {
      type: String,
      required: true,
    },
    workerExperience: {
      type: String,
      required: true,
    },
    homeAddress: {
      type: String,
      required: true,
    },
    accountDisable: {
      type: Boolean,
      default: false,
      enum: {
        values: [true, false],
        message: "Please provide an option only from --> true or false",
      },
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Excrypt the password before Save --- Hooks
drierSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Validate the password with passed on user password
drierSchema.methods.isPasswordValidated = async function (sentUserPassword) {
  return await bcrypt.compare(sentUserPassword, this.password);
};

// Create and Return JWT Token
drierSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000,
  });
};

// Generate Forgot Password Token
drierSchema.methods.getForgotPasswordToken = function () {
  // Generate a random long string value
  const forgotPwdToken = crypto.randomBytes(20).toString("hex");

  // Getting Hash for forgotPwdToken into DB - ** TODO: Make sure to get a hash on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotPwdToken)
    .digest("hex");

  // Time for exoiration of token
  this.forgotPasswordExpiry =
    Date.now() + process.env.FORGOT_PASSWORD_EXPIRY * 60 * 1000;

  return forgotPwdToken;
};

module.exports = model("Driver", drierSchema);
