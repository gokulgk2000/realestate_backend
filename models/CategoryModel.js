const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({


  name: {
    type: String,
    required: true,
  },
  
  aflag: {
    type: Boolean,
  }
});
module.exports = mongoose.model("categorymodel", categorySchema);