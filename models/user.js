const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    userUid: {
      type: Number,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    phoneNo: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
    },
    address: {
      type: String,
    },
    shortDescriotion: {
      type: String,
    },
    descriotion: {
      type: String,
    },
    googleUserId: {
      type: String,
      unique: true,
      select: false,
    },
    currentLocation: {
      type: [
        {
          latitude: { type: Date },
          longitude: { type: String },
        },
      ],
    },
    vehicleId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin", "manager"],
        message:
          "Please provide an option only from --> user, admin and manager",
      },
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
userSchema.pre("save", async function (next) {
  // this.userUid =
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Validate the password with passed on user password
userSchema.methods.isPasswordValidated = async function (sentUserPassword) {
  return await bcrypt.compare(sentUserPassword, this.password);
};

// Validate the password with passed on user password
userSchema.methods.isGoogleUserIdValidated = async function (sentGoogleUserId) {
  return sentGoogleUserId === this.googleUserId;
};

// Create and Return JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000,
  });
};

// Generate Forgot Password Token
userSchema.methods.getForgotPasswordToken = function () {
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

module.exports = model("User", userSchema);

// Sure, here's a sample mongoose schema with nested objects:

// const mongoose = require('mongoose');

// const PersonSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   contact: {
//     email: String,
//     phone: String,
//     address: {
//       street: String,
//       city: String,
//       country: String
//     }
//   }
// });

// const Person = mongoose.model('Person', PersonSchema);

// module.exports = Person;

// In this example, we have a `Person` schema with a `name` and `age` field, as well as a `contact` field that contains nested objects for `email`, `phone`, and `address`. The `address` object itself contains nested fields for `street`, `city`, and `country`.