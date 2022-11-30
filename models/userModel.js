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
      phoneno: {
        type: Number,
        required: true,
      },
      
    
      verified: {
        type: Boolean,
        default: false,
        required: true,
      },
      profilePic: {
        type: Array,
       
      },
    
    
      
      
      aflag: {
        type: Boolean,
      },
      status: {
        type: String,
       default:"approved"

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
module.exports = mongoose.model("usermodels", userSchema);
