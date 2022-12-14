const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// const serverless = require('serverless-http');
const config = require('../config');
const cors = require("cors");
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
        origin: true,
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

    app.get('/',(req,res)=> res.send("Welcome to Backend"))
    app.use("/api/user", require("../routes/userRoute"));
    app.use("/api/property", require("../routes/RegpropertyRoute"));
    app.use("/api/admin", require("../routes/adminRoute"));
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

