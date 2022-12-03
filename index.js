const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('./express/server');


const port = 8000;
process.on("exit", function () {
  console.log("db disconnected");
  mongoose.disconnect();
});

    app.listen(port, () => {
      console.log(`Server has started on port ${port}!`);
    });

