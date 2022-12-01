const express = require("express");
const router = express.Router();
const path = require("path");

const AuthController = require("../controllers/AuthController");

const { auth } = require("../middleware/auth-user.js");

router.get("/profile.html", auth, (req, res, next) => {
  res.sendFile('profile.html', { root: path.join(__dirname, '../static') });
});

router.get("/home.html", auth, (req, res, next) => {
  res.sendFile('home.html', { root: path.join(__dirname, '../static') });
});

router.get("connections.html", auth, (req, res, next) => {
  res.sendFile('connections.html', { root: path.join(__dirname, '../static') });
});



module.exports = router;
