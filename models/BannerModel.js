const mongoose = require('mongoose');
const bannerSchema = mongoose.Schema({
    adminID:{
       type: mongoose.Schema.Types.ObjectId,
       ref:"AdminModel",
    },
    adpic:[

    ]
});
module.exports = mongoose.model("bannerModel", bannerSchema);