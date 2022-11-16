const mongoose = require("mongoose");
const regpropertySchema = mongoose.Schema({
  regUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  Title: {
    type: String,
  },
  Area: {
    type: String,
  },
  Seller:{
    type: String,
  },
  Location :{
    type: String,
  },

  Layoutname: {
    type: String,
  },
  Seller: {
    type: String,
  },
  Landarea: {
    type: String,
  },
 
  Facing: {
    type: String,
  },
 
  Approchroad: {
    type: String,
  },
  Builtarea: {
    type: String,
  },
  propertyPic: [
    {
      type: String,
    },
  ],
  isPropertyPic: {
     type: Boolean,
      default: true
     },
  Bedroom: [{
    type: String,
  }],
  Bathroom: [{
    type: String,
  }],
  Floordetails: [{
    type: String,
  }],
  status: [{
    type: String,
  }],
  Neardown: [{
    type: String,
  }],
  Costsq: [{
    type: String,
  }],
  FromSchool: [{
    type: String,
  }],
  Fromcollage: [{
    type: String,
  }],
  Fromhospital: [{
    type: String,
  }],
  Frombusstand: [{
    type: String,
  }],
  Fromgandhipuram: [{
    type: String,
  }],
  Fromrailwaystation: [{
    type: String,
  }],
  Fromairport: [{
    type: String,
  }],
  Facilties: [{
    type: String,
  }],
  Askprice: [{
    type: String,
  }],
  propertyPic: { type: Boolean, default: true },
  Description: {
    type: String,
  },
  aflag: {
    type: Boolean,
  },
  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("RegPropertymodels", regpropertySchema);