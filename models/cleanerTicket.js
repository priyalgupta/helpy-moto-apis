const { model, Schema } = require("mongoose");

const cleanerTicketSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cleanerId: {
      type: Schema.Types.ObjectId,
      ref: "Cleaner",
      required: true,
    },
    typesOfServices: [
      {
        type: String,
        default: "normalCleaning",
        required: [
          true,
          "Please provide an option from --> normalCleaning, fullCleaning, dryCleaning",
        ],
        enum: {
          values: ["normalCleaning", "fullCleaning", "dryCleaning"],
          message:
            "Please provide an option only from --> normalCleaning, fullCleaning, dryCleaning",
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

module.exports = model("CleanerTicket", cleanerTicketSchema);
