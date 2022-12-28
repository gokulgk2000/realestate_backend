const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
    expireIn: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("otpmodels", otpSchema);
