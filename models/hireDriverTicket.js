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
    pickupDate: {
      type: String,
    },
    pickupTime: {
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
