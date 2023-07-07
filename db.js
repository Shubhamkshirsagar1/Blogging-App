const mongoose = require("mongoose");
var clc = require("cli-color");

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log(clc.cyanBright.underline("MongoDb Connected!!"));
  })
  .catch((error) => {
    console.log(clc.red(error));
  });
