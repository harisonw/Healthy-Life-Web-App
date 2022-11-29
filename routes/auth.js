const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/change-password', AuthController.changePassword);
router.post('/delete-account', AuthController.deleteAccount);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/auth-user', AuthController.authUser);
router.post('/get-user', AuthController.getUser);
router.post('/update-user', AuthController.updateUser);
router.post('/update-user-info', AuthController.updateUserInfo);

module.exports = router;