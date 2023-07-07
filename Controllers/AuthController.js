const express = require("express");
const { cleanUpAndValidate } = require("../utils/AuthUtils");

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, username, email, password } = req.body;

  await cleanUpAndValidate({ name, username, email, password })
    .then(() => {
      return res.send("Working");
    })
    .catch((error) => {
      return res.send({
        status: 400,
        message: "Data Invalid",
        error: error,
      });
    });

});

AuthRouter.post("/login", (req, res) => {
  return res.send(true);
});

module.exports = AuthRouter;
