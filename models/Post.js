const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    body: { type: String, maxlength: 300 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // photos saved as postID.jpg or postID.png etc in the uploads folder
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
