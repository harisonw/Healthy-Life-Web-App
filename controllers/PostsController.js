const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { auth } = require("../middleware/auth-user");

const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET;

//create a new post

// router.post("/create", auth, async (req, res) => {
//   user = req.user;
//   const newPost = new Post({
//     user: user.id,
//     title: req.body.title,
//     body: req.body.body,
//     photo: req.body.photo,
//   });

//   try {
//     const savedPost = await newPost.save();
//     res.status(200).json(savedPost);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//

// create a new post with image located in routes/posts.js

const sanitizeHTML = require("sanitize-html");
const { title } = require("process");

const uploadPost = async (req, res) => {
  // sanitize the title, body and image file name
  console.log("req.body: ", req.body.title);
  const title = sanitizeHTML(req.body.title);
  console.log("title: ", title);
  const body = sanitizeHTML(req.body.body);
  const newFileName = sanitizeHTML(req.newFileName);
    // update post in db
  try {
    await Post.findByIdAndUpdate(req.postID, {
      title: title,
      body: body,
      photo: newFileName,
    });
    // find updated post with new title and body
    const updatedPost = await Post.findById(req.postID);
    //console.log("updated post: ", updatedPost);
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

// serve the image
const serveImage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/" + req.params.id));
};

//update a post

//delete a post

//like a post
const likePost = async (req, res) => {
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
};

//get a post

//get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "fname");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  uploadPost,
  serveImage,
  likePost,
  getAllPosts,
};
