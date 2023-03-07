const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const cleanerSchema = new Schema(
  {
    cleanerName: {
      type: String,
      required: true,
    },
    cleanerPic: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
    },
    shopName: {
      type: String,
    },
    shopPic: {
      type: String,
    },
    shopDesc: {
      type: String,
    },
    workers: {
      type: String,
      required: true,
    },
    location: {
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
cleanerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Validate the password with passed on user password
cleanerSchema.methods.isPasswordValidated = async function (sentUserPassword) {
  return await bcrypt.compare(sentUserPassword, this.password);
};

// Create and Return JWT Token
cleanerSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000,
  });
};

// Generate Forgot Password Token
cleanerSchema.methods.getForgotPasswordToken = function () {
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

module.exports = model("Cleaner", cleanerSchema);
