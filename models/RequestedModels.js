const mongoose = require("mongoose");

const requestedSchema = mongoose.Schema({
   
      location: {
        type: String,
        
      },
      propertyType: {
        type: String,
      
      },
      facing: {
        type: String,
        
      },
      landArea: {
        type: String,
       
      },
      buildArea: {
        type: String,
       
      },
      expectedPrice: {
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
