const mongoose = require("mongoose");
const regpropertySchema =mongoose.Schema({
  regUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  Seller: {
    type: String,
  },

  location: {
    type: String,
  },
  layoutName: {
    type: String,
  },
  landArea: {
    type: String,
  },
  facing: {
    type: String,
  },
  approachRoad: {
    type: String,
  },
  builtArea: {
    type: String,
  },
  bedRoom: {
    type: String,
  },
  floorDetails: {
    type: String,
  },
  status: {
    type: String,
  },
  nearTown: {
    type: String,
  },
  costSq: {
    type: String,
  },
  facilities: {
    type: String,
  },
  askPrice: {
    type: String,
  },
  propertyPic: [
    {
      type: String,
    },
  ],

  isPropertyPic: { type: Boolean, default: true },

  Description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("RegPropertymodels", regpropertySchema);
