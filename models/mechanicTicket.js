const { model, Schema } = require("mongoose");

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

module.exports = model("MechanicTicket", mechanicTicketSchema);
