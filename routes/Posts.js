const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const verify = require("./verifyToken");

//Get all posts
router.get("/", verify, async (req, res) => {
  const posts = await Post.find().populate("postedBy", "_id name");
  res.send(posts);
});

//Get post for specific user
router.get("/myposts", verify, async (req, res) => {
  try {
    const myposts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.send({ status: true, posts: myposts });
  } catch (err) {
    res.status(404).send({ status: false, error: "Error Getting My Posts" });
  }
});

//Get posts by id
router.get("/:postId", verify, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.postId).populate(
      "postedBy",
      "_id name"
    );
    res.send(posts);
  } catch (e) {
    console.log(e);
    res
      .status(404)
      .send({ status: false, error: "Error Getting post by id" + e });
  }
});

//Create Post
router.post("/create", verify, async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    res
      .status(422)
      .send({ status: false, error: "Please Send All Required Fields" });
  }
  req.user.password = undefined;
  try {
    const post = new Post({ title, body, postedBy: req.user });
    var savedRes = await post.save();
    res.send({ status: true, post: savedRes });
  } catch (e) {
    console.log("error", e);
    res.json({ status: false, error: "Error creating Posts : " + e });
  }
});

//Delete post
router.delete("/:postId", verify, async (req, res) => {
  try {
    const status = await Post.remove({ _id: req.params.postId });
    res.json(status);
  } catch (e) {
    res.json({ status: false, error: "Error deleting Post " + e });
  }
});

//Update post
router.put("/:postId", verify, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title && !body) {
      res
        .status(422)
        .send({ status: false, error: "Please Send Fields to Update" });
    }
    const updObj = { title, body };
    if (!title) {
      delete updObj.title;
    }
    if (!body) {
      delete updObj.body;
    }
    console.log("updObj > ", updObj);
   
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updObj },
      { new: true }
    );
    res.send(post);
  } catch (e) {
    res.json({ status: false, error: "Error Updating Post " + e });
  }
});

module.exports = router;
