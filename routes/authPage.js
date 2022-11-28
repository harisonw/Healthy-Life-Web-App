const express = require('express');
const router = express.Router();
const path = require('path')

const AuthController = require('../controllers/AuthController');

const checkAuth = require('../middleware/auth-user.js');

router.get('/profile', checkAuth, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../static/profile.html'));
});


module.exports = router;