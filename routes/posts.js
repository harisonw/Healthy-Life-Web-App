const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { auth } = require("../middleware/auth-user");

const JWT_SECRET =
  "gb32hj4rgyT^%^%R^ygahjgdfajsh7*^&*^&*T'#'@~@ddfeqgwrlkjnwefr";

//create a new post

router.post("/create", auth, async (req, res) => {
  user = req.user;
  const newPost = new Post({
    user: user.id,
    title: req.body.title,
    body: req.body.body,
    photo: req.body.photo,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: async function (req, file, cb) {
    //file extension

      // create a post in the db
      user = req.user;
      console.log("req.body: ", req.body)
      const newPost = new Post({
        user: user.id,
      });

      try {
        const savedPost = await newPost.save();
        console.log("saved post id: ", savedPost.id)
        req.postID = savedPost.id;
      } catch (err) {
        console.log("error saving post: ", err)
      }

      req.newFileName = ""+ req.postID + path.extname(file.originalname);

    cb(null, req.newFileName);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  // update post in db
  try {
    await Post.findByIdAndUpdate(req.postID, {
      title: req.body.title,
      body: req.body.body,
      photo: req.newFileName,
    });
    // find updated post with new title and body
    const updatedPost = await Post.findById(req.postID);
    console.log("updated post: ", updatedPost)
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// serve the image
router.get("/uploads/:id", async (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/" + req.params.id));
});

//update a post

//delete a post

//like a post
router.post("/like", auth, async (req, res) => {
  user = req.user;
  const { postID } = req.body;
  try {
    const post = await Post.findById(postID);
    if (!post.likes.includes(user.id)) {
      await post.updateOne({ $push: { likes: user.id } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: user.id } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get a post

//get all posts
router.get("/get-all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "fname");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
