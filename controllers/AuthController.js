const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const speakeasy = require("speakeasy");

const JWT_SECRET =
  "gb32hj4rgyT^%^%R^ygahjgdfajsh7*^&*^&*T'#'@~@ddfeqgwrlkjnwefr";

const register = (req, res) => {
  var fname = req.body.fname;
  var email = req.body.email;
  var password = req.body.password;
  var newsletter = req.body.newsletter;

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
      fname: fname,
      newsletter: newsletter,
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
  var twoFACode = req.body.twoFACode;

  try {
    User.findOne({ email: email }, "password twoFAVerified secret").then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign({ id: user._id }, JWT_SECRET, {
              expiresIn: "1h",
            });
            if (user.twoFAVerified) {
              const twoFAVerifiedNow = speakeasy.totp.verify({
                secret: user.secret.base32,
                encoding: "base32",
                token: twoFACode,
              });
              console.log("secret.base32", user.secret.base32);
              console.log("twoFAVerifiedNow", twoFAVerifiedNow);
              if (!twoFAVerifiedNow) {
                return res.json({
                  status: "error",
                  error: "Invalid 2FA authentication code!",
                });
              }
            }
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60,
            });
            res.json({
              status: "ok",
              message: "Login successful!",
              id: user._id,
              token,
            });
          } else {
            res.json({
              status: "error",
              error:
                "No User found with this email or Password for the user is incorrect!",
            });
          }
        });
      } else {
        res.json({
          status: "error",
          error:
            "No User found with this email or Password for the user is incorrect!",
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

const authUser = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.json(false);
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      return res.json(true, user);
    });
  } catch (err) {
    return res.json(false);
  }
};

const getUser = async (req, res) => {
  console.log("getUser");
  const { token } = req.body;
  console.log("token", token);
  if (!token) return res.json(false);
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      const userFound = await User.findOne({ _id: user.id }, "-password");
      return res.json(userFound);
    });
  } catch (err) {
    return res.json(false);
  }
};

const changePassword = async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      const oldHashedPassword = await User.findOne(
        { _id: user.id },
        "-_id password"
      );
      console.log("oldHashedPassword", oldHashedPassword.password);
      bcrypt.compare(
        oldPassword,
        oldHashedPassword.password,
        async function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.updateOne(
              { _id: user.id },
              { $set: { password: hashedPassword } }
            );
            res.json({
              status: "ok",
              message: "Password changed successfully!",
            });
          } else {
            res.json({
              status: "error",
              error: "Old password is incorrect!",
            });
          }
        }
      );
    });
  } catch (err) {
    return res.json({
      status: "error",
      error: err,
    });
  }
};

// logout doens't need method, just delete the token from the client side and keep the token expiry time short

// delete account
const deleteAccount = async (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      await User.deleteOne({ _id: user.id });

      res.json({
        status: "ok",
        message: "Account deleted successfully!",
      });
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email }); // TODO: only get values needed
    console.log("forgot password");
    if (user) {
      // TODO: send email to user with a link to reset password
      res.json({
        status: "ok",
        message:
          "If user exists the password reset email will have been sent successfully!",
      });
    } else {
      res.json({
        status: "ok",
        error:
          "If user exists the password reset email will have been sent successfully!",
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
};

const updateUser = async (req, res) => {
  const { token, fname, email, newsletter } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      console.log(user);
      console.log(user._id);
      await User.updateOne(
        { _id: user.id },
        //set the values to update
        {
          $set: {
            fname: fname,
            email: email,
            newsletter: newsletter,
          },
        }
      );

      res.json({
        status: "ok",
        message: "Account updated successfully!",
      });
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
};

const updateUserInfo = async (req, res) => {
  const {
    token,
    sex,
    age,
    height,
    weight,
    avgHrsExercisePW,
    avgStepsPD,
    eatingHabits,
    avgHrsSleepPD,
    avgUnitsAlcoholPW,
    occupation,
  } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      console.log(user);
      console.log(user._id);
      await User.updateOne(
        { _id: user.id },
        //set the values to update
        {
          $set: {
            sex: sex,
            age: age,
            height: height,
            weight: weight,
            avgHrsExercisePW: avgHrsExercisePW,
            avgStepsPD: avgStepsPD,
            eatingHabits: eatingHabits,
            avgHrsSleepPD: avgHrsSleepPD,
            avgUnitsAlcoholPW: avgUnitsAlcoholPW,
            occupation: occupation,
          },
        }
      );

      res.json({
        status: "ok",
        message: "Account Info updated successfully!",
      });
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
};

const setup2FA = async (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      console
        .log
        //set the values to update
        ();
      secret = speakeasy.generateSecret();
      // update user with secret and create if not exists
      await User.updateOne(
        { _id: user.id },
        {
          $set: {
            secret: secret,
          },
        },
        { upsert: false }
      );

      res.json({
        status: "ok",
        message: "2FA setup successfully!",
        secret: secret, // todo: .base32??
      });
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
    });
  }
};

const verify2FA = async (req, res) => {
  const { token, code } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      console.log("user", user);
      user = await User.findOne({ _id: user.id }, "secret");
      const twoFAVerified = speakeasy.totp.verify({
        secret: user.secret.base32,
        encoding: "base32",
        token: code,
      });
      console.log("secret.base32", user.secret.base32);
      console.log("twoFAVerified", twoFAVerified);
      if (twoFAVerified) {
        await User.updateOne(
          { _id: user.id },
          {
            $set: {
              twoFAVerified: true,
            },
          }
        );
        res.json({
          status: "ok",
          message: "2FA verified successfully!",
        });
      } else {
        res.json({
          status: "error",
          error: "2FA code is incorrect!",
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
  authUser,
  getUser,
  changePassword,
  deleteAccount,
  forgotPassword,
  updateUser,
  updateUserInfo,
  setup2FA,
  verify2FA,
};
