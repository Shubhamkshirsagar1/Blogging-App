const express = require("express");
var clc = require("cli-color");
require("dotenv").config();

const server = express();

//file imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

//Variables
const PORT = process.env.PORT;

//Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Routes
server.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Welcome to your blogging app",
  });
});

server.use("/auth", AuthRouter);

server.listen(PORT, () => {
  console.log(clc.yellow.underline(`Server is running on Port ${PORT}`));
});
