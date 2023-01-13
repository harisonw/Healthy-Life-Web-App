const router = require("express").Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

const { auth } = require("../middleware/auth-user");

const JWT_SECRET = process.env.JWT_SECRET;

const PostsController = require("../controllers/PostsController");

// create a new post with image
const middle = require("../middleware/post-middleware");

router.post(
  "/upload",
  auth,
  middle.upload.single("image"),
  PostsController.uploadPost
);

// serve the image
router.get("/uploads/:id", PostsController.serveImage);

//update a post

//delete a post

//like a post
router.post("/like", auth, PostsController.likePost);

//get a post

//get all posts
router.get("/get-all", PostsController.getAllPosts);

module.exports = router;
