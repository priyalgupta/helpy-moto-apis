const { model, Schema } = require("mongoose");

const driverTicketSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    scheduleOfService: {
      type: String,
      default: "current",
      required: [true, "Please provide an option from --> current, scheduled"],
      enum: {
        values: ["current", "scheduled"],
        message: "Please provide an option only from --> current, scheduled",
      },
    },
    typesOfServices: [
      {
        type: String,
        default: "roundTrip",
        required: [
          true,
          "Please provide an option from -->  onewayTrip, roundTrip",
        ],
        enum: {
          values: ["onewayTrip", "roundTrip"],
          message:
            "Please provide an option only from -->  onewayTrip, roundTrip",
        },
      },
    ],
    otherServiceTypeText: {
      type: String,
    },
    modeOfService: {
      type: String,
      required: [
        true,
        "Please provide an option from --> onSite, pickupAndDrop",
      ],
      enum: {
        values: ["onSite", "pickupAndDrop"],
        message: "Please provide an option only from --> onSite, pickupAndDrop",
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
      default: "pending",
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
      type: String,
    },
    trackingLocation: {
      type: String,
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

module.exports = model("DriverTicket", driverTicketSchema);
