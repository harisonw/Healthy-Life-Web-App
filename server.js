const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const AuthRoute = require("./routes/auth");
const port = 3000;
var db = "mongodb://127.0.0.1:27017/HealthyLife";

mongoose.connect(db);

app.use("/api/user", AuthRoute);

const AuthPage = require("./routes/authPage");
app.use("/", AuthPage);

const PostRoute = require("./routes/posts");
app.use("/api/posts", PostRoute);

// Static must be after all routes, otherwise the protected routes will not work
app.use("/", express.static(path.join(__dirname, "static")));

app.listen(3000, () => console.log("server listening on port " + port));
