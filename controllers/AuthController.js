const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  if (
    !email ||
    typeof email !== "string" ||
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    ) === false
  ) {
    return res.json({ status: "error", error: "Invalid email" });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return res.json({ status: "error", error: "Invalid password" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.json({
        error: err,
      });
    }

    let user = new User({
      email: email,
      password: hashedPassword,
    });

    user
      .save()
      .then((user) => {
        res.json({
          status: "ok",
          message: "User added successfully!",
        });
      })
      .catch((error) => {
        if (error.code === 11000) {
          console.log("Duplicate key");
          res.json({
            status: "error",
            error: "Email already exists!",
          });
        } else {
          console.log("Error: not duplicate key");
          res.json({
            status: "error",
            message: "An error occurred!",
            error: error,
          });
        }
      });
  });
};

const login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  console.log(email, password);

  try {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign({ name: user }, "healthyLifeKey", {
              expiresIn: "1h",
            });
            res.json({
              status: "ok",
              message: "Login successful!",
              token,
            });
          } else {
            res.json({
              status: "error",
              error: "No User found with this email or Password for the user is incorrect!",
            });
          }
        });
      } else {
        res.json({
          status: "error",
          error: "No User found with this email or Password for the user is incorrect!",
        });
      }
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
};

module.exports = {
  register,
  login,
};
