const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    
      verified: {
        type: Boolean,
        default: false,
        required: true,
      },
      propertyPic: {
        type: String,
       
      },
    
      isPropertyPic: { type: Boolean, default: true },
      
      
      aflag: {
        type: Boolean,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
      propertyStatus: {
        type: String,
      },
      lastModified: {
        type: Date,
        default: Date.now(),
      },
    });
module.exports = mongoose.model("usermodels", userSchema);
