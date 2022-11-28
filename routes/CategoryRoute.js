const express = require("express");
const router = express.Router();
const config = require("../config");
const CategoryModel = require("../models/CategoryModel");
const { listeners } = require("../models/RegPropertyModel");
const RegPropertyModel = require("../models/RegPropertyModel");



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
      msg:"category selected",
      category
    })
  }
})

})
router.post("/getPropertiescategoryId", async (req, res) => {
  try {
    const { id ,searchText=""} = req.body;
    let regex = new RegExp(searchText,'i');
    let categoryQuery=({isBlock:"false",status:"Approved"})
    if(searchText !==null && searchText!==undefined) categoryQuery.$or = [
      { location: regex },
      { askPrice: regex },
      { bedRoom: regex },
      { floorDetails : regex },
      {facing: regex },
    ]
    if (id) categoryQuery.category=id
    console.log(categoryQuery)
    RegPropertyModel.find(categoryQuery,(err,category) => {
        if (err) {
          return res.json({
            msg: err ,
          });         
        }
        else {
          return res.json({
            success: true,
            category
          });
        }
      });
  } catch (err) {
    return res.json({ msg: "errrrr" ,err});
  }
});

module.exports = router;