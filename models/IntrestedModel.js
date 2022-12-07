const mongoose = require("mongoose");

const requestedSchema = mongoose.Schema({
    regUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buyermodels",
      },
      propertyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegPropertymodels",
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
module.exports = mongoose.model("intrestedmodels", requestedSchema);
