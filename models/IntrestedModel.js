const mongoose = require("mongoose");

const requestedSchema = mongoose.Schema({
    regUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usermodels",
      },
      propertyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegPropertymodels",
      },
      aflag: {
        type: Boolean,
      },
      isInterested: {
        type:Boolean,
        default:false
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
module.exports = mongoose.model("intrestedmodels", requestedSchema);
