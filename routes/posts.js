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
