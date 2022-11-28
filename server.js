const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

const AuthRoute = require('./routes/auth');
const port = 3000;
var db = 'mongodb://127.0.0.1:27017/HealthyLife';

mongoose.connect(db);

app.use('/api/user', AuthRoute);
app.use('/', express.static(path.join(__dirname, 'static')));

const AuthPage = require('./routes/authPage');
app.use('/', AuthPage);

app.listen(3000, () => console.log('server listening on port ' + port));