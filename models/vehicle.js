const { model, Schema } = require("mongoose");

const vehicleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    number: {
      type: String,
      required: true,
    },
    cNumber: {
      type: String,
      required: true,
    },
    bYear: {
      type: String,
      required: true,
    },
    cylenderNo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Vehicle", vehicleSchema);
