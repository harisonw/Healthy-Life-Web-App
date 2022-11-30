const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth-user.js");

const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.post("/change-password", auth, AuthController.changePassword);
router.post("/delete-account", auth, AuthController.deleteAccount);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/get-user", auth, AuthController.getUser);
router.post("/update-user", auth, AuthController.updateUser);
router.post("/update-user-info", auth, AuthController.updateUserInfo);
router.post("/setup-2fa", auth, AuthController.setup2FA);
router.post("/verify-2fa", auth, AuthController.verify2FA);

router.post("/auth", AuthController.auth);

module.exports = router;
