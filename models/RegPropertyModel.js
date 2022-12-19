const mongoose = require("mongoose");
const regpropertySchema =mongoose.Schema({
  regUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoryModel",
  },
  
  Seller: {
    type: String,
  },
  Title: {
    type: String,
  },

  location: {
    type: String,
  },
  streetName: {
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
  propertyStatus: {
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
    
  ],

  isPropertyPic: { type: Boolean, default: true },

  Description: {
    type: String,
  },
  status: {
    type: String,
    default:"pending"
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  aflag: {
    type: Boolean,
  },
  isBlock:{
   type:Boolean,
   default:false
  }
});
module.exports = mongoose.model("RegPropertymodels", regpropertySchema);
