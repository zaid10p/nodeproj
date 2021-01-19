const Post = require("../models/Post");

class PostRepo {
  static getAll = async () => {
    return await Post.find().populate("postedBy", "_id name");
  };

  //get all post by user
  static getAllUserPosts = async (userId) => {
    return await Post.find({ postedBy: userId }).populate(
      "postedBy",
      "_id name"
    );
  };

  static getPostById = async (postId) => {
    return await Post.findById(postId).populate("postedBy", "_id name");
  };

  static deletePost = async (postId) => {
    return await Post.remove({ _id: postId });
  };

  static createPost = async ({ title, body, postedBy }) => {
    const post = new Post({ title, body, postedBy });
    return await post.save();
  };

  static updatePost = async (postId, updObj) => {
    return await Post.findByIdAndUpdate(
      postId,
      { $set: updObj },
      { new: true }
    );
  };
}

module.exports = PostRepo;
