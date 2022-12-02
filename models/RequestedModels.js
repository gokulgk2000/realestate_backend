const mongoose = require("mongoose");

const requestedSchema = mongoose.Schema({
    regUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    facing: {
        type: String,
        
      },
      location: {
        type: String,
      
      },
      nearTown: {
        type: String,
        
      },
      askPrice: {
        type: String,
       
      },
     
      verified: {
        type: Boolean,
        default: false,
        
      },
     
      aflag: {
        type: Boolean,
      },
      status: {
        type: String,
       default:"pending"

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
module.exports = mongoose.model("requestedmodels", requestedSchema);
