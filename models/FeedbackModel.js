const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usermodels",
  },
  category: {
    type: String,
  },
  budgetfrom: {
    type: String,
  },
  to: {
    type: String,
  },
  area: {
    type: String,
  },
  propertyType: {
    type: String,
  },

  comment: {
    type: String,
  },
  phonenumber: {
    type: String,
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
module.exports = mongoose.model("feedbackmodels", feedbackSchema);
