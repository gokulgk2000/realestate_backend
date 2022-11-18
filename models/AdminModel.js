const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  aflag: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("AdminModel", adminSchema);