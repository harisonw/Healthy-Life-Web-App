const path = require("path");
const multer = require("multer");
const User = require("../models/User");
const Post = require("../models/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: async function (req, file, cb) {
    // create a post in the db
    user = req.user;
    //console.log("req.body: ", req.body);
    const newPost = new Post({
      user: user.id,
    });

    try {
      const savedPost = await newPost.save();
      //console.log("saved post id: ", savedPost.id);
      req.postID = savedPost.id;
    } catch (err) {
      console.log("error saving post: ", err);
    }

    req.newFileName = "" + req.postID + path.extname(file.originalname);

    cb(null, req.newFileName);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
