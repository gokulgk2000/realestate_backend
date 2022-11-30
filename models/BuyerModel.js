const mongoose = require("mongoose");
const buyerSchema = mongoose.Schema({
  firstname: {
    type: String,
    
  },
  lastname: {
    type: String,
   
  },
  email: {
    type: String,
    
  },
  propertyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RegPropertymodels",
  },
 
  phonenumber:{
    type: String,
   },  
  status: {
    type: String,
    default:"pending"
  },
   
      aflag: {
        type: Boolean,
      },
    });

    module.exports = mongoose.model("buyermodels", buyerSchema);
