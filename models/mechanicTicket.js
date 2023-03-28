const { model, Schema } = require("mongoose");
const { fourDigitOtpGenerator } = require("../utils/otpGeneratoe");

const mechanicTicketSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanicId: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },
    scheduleOfService: {
      type: String,
      default: "onTime",
      required: [true, "Please provide an option from --> onTime, scheduled"],
      enum: {
        values: ["onTime", "scheduled"],
        message: "Please provide an option only from --> onTime, scheduled",
      },
    },
    typesOfServices: [
      {
        type: String,
        default: "brakedown",
        required: [
          true,
          "Please provide an option from --> brakedown, puncher, others",
        ],
        enum: {
          values: ["brakedown", "puncher", "others"],
          message:
            "Please provide an option only from --> brakedown, puncher, others",
        },
      },
    ],
    otherServiceTypeText: {
      type: String,
    },
    modeOfService: {
      type: String,
      required: [true, "Please provide an option from --> pick-up, drop, both"],
      enum: {
        values: ["pick-up", "drop", "both"],
        message: "Please provide an option only from --> pick-up, drop, both",
      },
    },
    query: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "notAccepted",
      required: [
        true,
        "Please provide an option from --> pending, accepted, rejected, completed, inProcess",
      ],
      enum: {
        values: ["pending", "accepted", "rejected", "completed", "inProcess"],
        message:
          "Please provide an option only from --> pending, accepted, rejected, completed, inProcess",
      },
    },
    currentLocation: {
      type: [
        {
          latitude: { type: Date },
          longitude: { type: String },
        },
      ],
    },
    trackingLocation: {
      type: [
        {
          latitude: { type: Date },
          longitude: { type: String },
        },
      ],
    },
    distance: {
      type: String,
    },
    totalPrice: {
      type: String,
    },
    paymentMode: {
      type: String,
      default: "card",
      required: [
        true,
        "Please provide an option from --> card, upi, netBanking, cod",
      ],
      enum: {
        values: ["card", "upi", "netBanking", "cod"],
        message:
          "Please provide an option only from --> card, upi, netBanking, cod",
      },
    },
    paymentStatus: {
      type: String,
      default: "pending",
      required: [
        true,
        "Please provide an option from --> pending, paid, moneyBack, due",
      ],
      enum: {
        values: ["pending", "paid", "moneyBack", "due"],
        message:
          "Please provide an option only from --> pending, paid, moneyBack, due",
      },
    },
    onTimeOTP: {
      type: String,
    },
    isVerifiedOnTimeOTP: {
      type: Boolean,
      default: false,
    },
    scheduledArrivedOTP: {
      type: String,
    },
    isVerifiedscheduledArrivedOTP: {
      type: Boolean,
      default: false,
    },
    scheduledWorkshopOTP: {
      type: String,
    },
    isVerifiedscheduledWorkshopOTP: {
      type: Boolean,
      default: false,
    },
    scheduledDeliveredOTP: {
      type: String,
    },
    isVerifiedscheduledDeliveredOTP: {
      type: Boolean,
      default: false,
    },
    pickupPlace: {
      type: String,
    },
    pickupDate: {
      type: String,
    },
    pickupTime: {
      type: String,
    },
    dropPlace: {
      type: String,
    },
    dropDate: {
      type: String,
    },
    dropTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generating the Verification OTP
mechanicTicketSchema.pre("save", async function (next) {
  if (this.scheduleOfService === "onTime") {
    this.onTimeOTP = await fourDigitOtpGenerator().toString();
  } else if (this.scheduleOfService === "scheduled") {
    this.scheduledArrivedOTP = await fourDigitOtpGenerator().toString();
  }
});

// Validate the OnTime Verification OTP
mechanicTicketSchema.methods.isOnTimeOTPValidated = async function (sentOTP) {
  return sentOTP.toString() === this.onTimeOTP;
};

// Validate the scheduled Arrival Verification OTP
mechanicTicketSchema.methods.isScheduledArriveOTPValidated = async function (
  sentOTP
) {
  return sentOTP.toString() === this.scheduledArrivedOTP;
};

// Validate the scheduled workshop arrival OTP generate
mechanicTicketSchema.methods.generateScheduledWorkshopOTP = async function () {
  this.scheduledWorkshopOTP = await fourDigitOtpGenerator().toString();
};

// Validate the scheduled workshop arrival Verification OTP
mechanicTicketSchema.methods.isScheduledWorkshopOTPValidated = async function (
  sentOTP
) {
  return sentOTP.toString() === this.scheduledWorkshopOTP;
};

// Validate the scheduled Arrival Verification OTP
mechanicTicketSchema.methods.generateScheduledDeliveredOTP = async function () {
  this.scheduledDeliveredOTP = await fourDigitOtpGenerator().toString();
};

// Validate the scheduled Arrival Verification OTP
mechanicTicketSchema.methods.isScheduledDeliveredOTPValidated = async function (
  sentOTP
) {
  return sentOTP.toString() === this.scheduledDeliveredOTP;
};

module.exports = model("MechanicTicket", mechanicTicketSchema);