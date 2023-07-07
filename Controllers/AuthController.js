const express = require("express");
const {
  registerCleanUpAndValidate,
  loginCleanUpAndValidate,
} = require("../utils/AuthUtils");
const User = require("../Models/UserModel");
const { isAuth } = require("../Middlewares/AuthMiddleware");
const AuthRouter = express.Router();

// Registraction
AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, username, email, password } = req.body;

  // Data Clean-Up
  await registerCleanUpAndValidate({ name, username, email, password })
    .then(async () => {
      //Check whether user exists in database or not
      try {
        await User.verifyUsernameAndEmailExists({ username, email });
      } catch (error) {
        return res.send({
          status: 400,
          message: "Error Occured!!",
          error: error,
        });
      }

      //Create an object for User Class
      const userObj = new User({
        name: name,
        username: username,
        email: email,
        password: password,
      });

      try {
        const userDb = await userObj.registerUser();

        return res.send({
          status: 201,
          message: "User Created Successfully!!",
          data: userDb,
        });
      } catch (error) {
        return res.send({
          status: 500,
          message: "Database Error!!",
          error: error,
        });
      }
    })
    .catch((error) => {
      return res.send({
        status: 400,
        message: "Data Invalid",
        error: error,
      });
    });
});

//Login
AuthRouter.post("/login", async (req, res) => {
  console.log(req.body);
  const { loginId, password } = req.body;

  // Data Clean-Up
  await loginCleanUpAndValidate({ loginId, password })
    .then(async () => {
      try {
        const userDb = await User.loginUser({ loginId, password });

        //Now Add session cookies
        console.log(req.session);
        req.session.isAuth = true;
        console.log("New Session-->", req.session);

        req.session.user = {
          userId: userDb._id,
          username: userDb.username,
          email: userDb.email,
        };
        return res.send({
          status: 200,
          message: "Login Successfull!!",
          data: userDb,
        });
      } catch (error) {
        return res.send({
          status: 400,
          message: "Error Occured!!",
          error: error,
        });
      }
    })
    .catch((error) => {
      return res.send({
        status: 400,
        message: "Data Invalid",
        error: error,
      });
    });
});

//Check Session
AuthRouter.get("/check", isAuth, (req, res) => {
  return res.send("Valid Session!!");
});

//Logout
AuthRouter.get("/logout", isAuth, (req, res) => {
  const user = req.session.user;
  console.log(user);

  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 400,
        message: "Logout UnSuccessfull!!",
        error: err,
      });
    }

    return res.send({
      status: 200,
      message: "Logout Successfull!!",
      data: user,
    });
  });
});

module.exports = AuthRouter;
