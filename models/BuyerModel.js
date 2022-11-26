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
    
    type: String,
  },
 
  phonenumber:{
   type: String,
  },

    
   
    
      
      aflag: {
        type: Boolean,
      },
     
     
    
    });

    module.exports = mongoose.model("buyermodels", buyerSchema);
