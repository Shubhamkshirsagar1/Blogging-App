var validator = require("validator");

const registerCleanUpAndValidate = ({ name, username, email, password }) => {
  return new Promise((resolve, reject) => {
    if (!name || !username || !email || !password) {
      reject("Missing Credentials!!");
    }

    if (typeof email !== "string") {
      reject("Invalid Email");
    }

    if (typeof username !== "string") {
      reject("Invalid Username");
    }

    if (typeof password !== "string") {
      reject("Invalid Password");
    }

    if (username.length <= 2 || username.length > 50) {
      reject("Usernames length should be in 3-50 letters");
    }

    if (password.length <= 7 || password.length > 25) {
      reject("Password length should be in 7-25 letters");
    }

    // Validator package for email
    if (!validator.isEmail(email)) {
      reject("Invalid Email format!!");
    }
    if (!validator.isLowercase(email)) {
      reject("Email should be in lowercase");
    }

    resolve();
  });
};

const loginCleanUpAndValidate = ({ loginId, password }) => {
  return new Promise((resolve, reject) => {
    if (!loginId || !password) {
      reject("Missing Credentials!!");
    }

    if (typeof loginId !== "string") {
      reject("Invalid Login-ID!");
    }

    if (typeof password !== "string") {
      reject("Invalid Password!");
    }

    resolve();
  });
};

module.exports = { registerCleanUpAndValidate, loginCleanUpAndValidate };
