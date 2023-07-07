const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");

let User = class {
  name;
  username;
  email;
  password;

  constructor({ name, username, email, password }) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      //Hash the Password
      const hashPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT_ROUNDS)
      );

      //We will get UserSchema from Schemas
      const user = new UserSchema({
        name: this.name,
        username: this.username,
        email: this.email,
        password: hashPassword,
      });

      //Database Call
      try {
        const userDb = await user.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUsernameAndEmailExists({ username, email }) {
    return new Promise(async (resolve, reject) => {
      const userExists = await UserSchema.findOne({
        $or: [{ email: email }, { username: username }],
      });

      //Check for Email
      if (userExists && userExists.email === email) {
        reject("Email Already Exists!!");
      }

      //Check for Username
      if (userExists && userExists.username === username) {
        reject("Username Already Exists!!");
      }

      return resolve();
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        //Fine the user with loginId
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) {
          return reject("User doesn't Exists. Please Register!!");
        }

        //If user exists then match the password
        const comparePassword = await bcrypt.compare(password, userDb.password);
        if (!comparePassword) {
          return reject("Password Does not Match!!");
        }

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;

// Server ---> Controller ---> Model ---> Schema ---> Mongoose(functionality like save())
