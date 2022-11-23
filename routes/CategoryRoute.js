const express = require("express");
const router = express.Router();
const config = require("../config");
const CategoryModel = require("../models/CategoryModel");



router.get("/", (req, res) => res.send("category route"));

router.post("/getcategory", async (req, res) =>{

    const { name } = req.body
    
   CategoryModel.create({name}, async (err, category) =>{

   if(err){
    return res.json({
    msg: "pls select category ",
    error: err,
})
   }else {
    return res.json({
      success: true,
      msg: " category added",
      category
    });
  }


    }
    
    )
})

router.get("/findCategory",async(req,res)=>{

CategoryModel.find({},(err,category)=>{

  if(err){
    return res.json({
     msg:'select category' ,

    })
   
  }
  
  else{
    return res.json({
      success:true,
      msg:"added",
      category
    })
  }
})

})
module.exports = router;