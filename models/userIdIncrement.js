const { model, Schema } = require("mongoose");

const userIdIncrement = new Schema({
  keyId: {
    type: String,
  },
  userSequenceId: {
    type: Number,
    required: true,
  },
});

module.exports = model("UserIncrementId", userIdIncrement);
