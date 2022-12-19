const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');
// const serverless = require('serverless-http');
const config = require('../config');
const cors = require("cors");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
// const router = express.Router();

    const app=express();
    //DB connection
    mongoose.connect(config.MONGO_URL,{
        useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(()=>console.log("DB connected successfully"))
    .catch((err)=>console.log(err))

    app.use(express.json({ limit: "50mb" }));
    app.use(
      express.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 500000,
      })
    );
    app.use(
      cors({
        // origin: "http://localhost:3000",
        origin: true,
        credentials: true,
        exposedHeaders: ["set-cookie"],
      })
    ); 
     //file uploading
  let gfs;
  mongoose.connection.on("connected", () => {
    const db = mongoose.connections[0].db;
    gfs = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "attachments",
    });
  });
  //Declaring GridFS storage
  const storage = new GridFsStorage({
    url: config.MONGO_URL,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            console.log("Final Step err:", err);
            return reject(err);
          }
          const filename =
            buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "attachments",
          };
          console.log("Final Step fileInfo:", fileInfo);
          resolve(fileInfo);
        });
      });
    },
  });

  const store = multer({
    storage,
    // fileFilter: function (req, file, cb) {
    //   checkFileType(file, cb);
    // },
  });
  //Checking file types
  function checkFileType(file, cb) {
    const filetypes = /jpeg|doc|docx|xls|xlsx|jpg|png|pdf|zip/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb("filetype");
  }
  const uploadMiddleware = (req, res, next) => {
    console.log("uploadMiddleware")

    const upload = store.array("file");
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("file to large");
      } else if (err) {
        console.log("m error: ", err);
        if (err === "filetype") return res.status(400).send("file type error");
        return res.send("file upload error");
      }
    console.log("uploadMiddleware success")
      next();
    });
  };
  app.post("/upload", uploadMiddleware, async (req, res) => {
    const { files } = req;
    console.log("files: ",files)

    return res.json({ success: true, files });
  });

  app.get("/file/:id", ({ params: { id } }, res) => {
    if (!id || id === "undefined") return res.status(400).send("no image id");
    console.log("id",id);
    const _id = new mongoose.Types.ObjectId(id);
    gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0)
        return res.status(400).send("no files exist");
      // if a file exists, send the data
      gfs.openDownloadStream(_id).pipe(res);
    });
  });

    app.get('/',(req,res)=> res.send("Welcome to Backend"))
    app.use("/api/user", require("../routes/userRoute"));
    app.use("/api/property", require("../routes/RegpropertyRoute"));
    app.use("/api/admin", require("../routes/AdminRoute"));
    app.use("/api/category", require("../routes/CategoryRoute"));
    app.use("/api/buyer", require("../routes/BuyerRoute"));
    app.use("/api/requested", require("../routes/RequestedRoute"));
    app.use("/api/intrested", require("../routes/IntrestedRoute"));
    app.use("/api/feedback", require("../routes/FeedbackRoute"));
    app.use("/api/payment", require("../routes/PaymentRoute"));
    
    // app.use('/.netlify/functions/server', router);  // path must route to lambda
    // app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));


    module.exports = app;
    // module.exports.handler = serverless(app);

