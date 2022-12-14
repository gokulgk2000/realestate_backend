const express = require("express");
const router = express.Router();
const config = require("../config");
const CategoryModel = require("../models/CategoryModel");
const { listeners } = require("../models/RegPropertyModel");
const RegPropertyModel = require("../models/RegPropertyModel");

router.get("/", (req, res) => res.send("category route"));

router.post("/getcategory", async (req, res) => {
  const { name } = req.body;

  CategoryModel.create({ name }, async (err, category) => {
    if (err) {
      return res.json({
        msg: "pls select category ",
        error: err,
      });
    } else {
      return res.json({
        success: true,
        msg: " category added",
        category,
      });
    }
  });
});

router.get("/findCategory", async (req, res) => {
  CategoryModel.find({}, (err, category) => {
    if (err) {
      return res.json({
        msg: "select category",
      });
    } else {
      return res.json({
        success: true,
        msg: "category selected",
        category,
      });
    }
  });
});
router.post("/getPropertiescategoryId", async (req, res) => {
  try {
    const { id, searchText = "", bedRoom } = req.body;
    let regex = new RegExp(searchText, "i");
    let categoryQuery = {
      isBlock: "false",
      status: "approved",
    };
    if (bedRoom){ {categoryQuery.bedRoom = { $gte:bedRoom };} 
  }
    if (searchText !== null && searchText !== undefined)
      categoryQuery.$or = [
        { title: regex },
        { location: regex },
      ];
    if (id) categoryQuery.category = id;
    RegPropertyModel.find(categoryQuery, (err, category) => {
      if (err) {
        return res.json({
          msg: err,
        });
      } else {
        return res.json({
          success: true,
          category,
        });
      }
    });
  } catch (err) {
    return res.json({ msg: "errrrr", err });
  }
});

module.exports = router;
