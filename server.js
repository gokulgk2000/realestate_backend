const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require("cors");

const create=async() =>{
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
        origin: "http://localhost:3000",
        credentials: true,
        exposedHeaders: ["set-cookie"],
      })
    ); //Body parser
    app.use(express.json({ limit: "50mb" }));
    app.use(
      express.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 500000,
      })
    );

    // app.get('/',(req,res)=> res.send("Welcome to Backend"))
    app.use("/api/user", require("./routes/userRoute"));
    app.use("/api/property", require("./routes/RegpropertyRoute"));
    app.use("/api/admin", require("./routes/AdminRoute"));
    app.use("/api/category", require("./routes/CategoryRoute"));
    app.use("/api/buyer", require("./routes/BuyerRoute"));
    
    




    return app;
};
module.exports = {
    create,
  };