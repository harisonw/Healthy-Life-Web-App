const express = require('express');
const router = express.Router();
const path = require('path')

const AuthController = require('../controllers/AuthController');

const { auth } = require('../middleware/auth-user.js');

router.get('/profile', auth, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../static/profile.html'));
});


module.exports = router;