const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  img: String,
  title: String,
  content: String
});

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post, PostSchema };
