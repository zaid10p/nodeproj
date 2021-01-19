const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");
const PostService = require("../services/PostService");

//Get all posts
router.get("/", verify, async (req, res) => {
  PostService.getall(req, res);
});

//Get post for specific user
router.get("/myposts", verify, async (req, res) => {
  PostService.getAllUserPosts(req, res);
});

//Get posts by id
router.get("/:postId", verify, async (req, res) => {
  PostService.getPostById(req, res);
});

//Create Post
router.post("/create", verify, async (req, res) => {
  PostService.createPost(req, res);
});

//Delete post
router.delete("/:postId", verify, async (req, res) => {
  PostService.deletePost(req, res);
});

//Update post
router.put("/:postId", verify, async (req, res) => {
  PostService.updatePost(req, res);
});

module.exports = router;
