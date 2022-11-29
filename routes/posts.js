const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "gb32hj4rgyT^%^%R^ygahjgdfajsh7*^&*^&*T'#'@~@ddfeqgwrlkjnwefr"

//create a new post

router.post("/", async (req, res) => {
    const newPost = new Post({
        user: req.body.user,
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
router.post("/like", async (req, res) => {
    const { token, postID } = req.body;
    try {
        jwt.verify(token, JWT_SECRET, async (err, user) => {
            console.log("user", user);

            const post = await Post.findById(postID);
            if (!post.likes.includes(user.id)) {
                await post.updateOne({ $push: { likes: user.id } });
                res.status(200).json("The post has been liked");
            } else {
                await post.updateOne({ $pull: { likes: user.id } });
                res.status(200).json("The post has been disliked");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


const setup2FA = async (req, res) => {
    const { token } = req.body;
    try {
      jwt.verify(token, JWT_SECRET, async (err, user) => {
        console.log("user", user);
        console
          .log
          //set the values to update
          ();
        secret = speakeasy.generateSecret();
        // update user with secret and create if not exists
        await User.updateOne(
          { _id: user.id },
          {
            $set: {
              secret: secret,
            },
          },
          { upsert: false }
        );
  
        res.json({
          status: "ok",
          message: "2FA setup successfully!",
          secret: secret, // todo: .base32??
        });
      });
    } catch (error) {
      res.json({
        status: "error",
        error: error,
      });
    }
  };

//get a post

//get all posts
router.get("/get-all", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;