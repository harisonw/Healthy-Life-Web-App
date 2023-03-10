require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const cors = require("cors");

const app = express();
app.use(cors());
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const AuthRoute = require("./routes/auth");
const PORT = process.env.PORT || 3000;
var db = "mongodb://127.0.0.1:27017/HealthyLife";

mongoose.connect(db).catch((err) => console.log(err));

app.use("/api/user", AuthRoute);

const AuthPage = require("./routes/authPage");
app.use("/", AuthPage);

const PostRoute = require("./routes/posts");
app.use("/api/posts", PostRoute);

const ArticleRoute = require("./routes/articles");
app.use("/api/articles", ArticleRoute);

// Static must be after all routes, otherwise the protected routes will not work
app.use("/", express.static(path.join(__dirname, "static")));

//app.listen(3000, () => console.log("server listening on port " + port));

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log("server listening on port " + PORT));
}

// export app and db for testing
module.exports = { app, db };
