const PostRepo = require("../repositories/PostRepo");

class PostService {
  static getall = async (req, res) => {
    const posts = await PostRepo.getAll();
    return res.send(posts);
  };

  static getAllUserPosts = async (req, res) => {
    try {
      const myposts = await PostRepo.getAllUserPosts(req.user._id);
      return res.send(myposts);
    } catch (err) {
      return res
        .status(404)
        .send({ status: false, error: "Error Getting My Posts" + err });
    }
  };

  static getPostById = async (req, res) => {
    try {
      const post = await PostRepo.getPostById(req.params.postId);
      return res.send(post);
    } catch (err) {
      return res
        .status(400)
        .send({ status: false, error: "Error Getting PostbyId" + err });
    }
  };

  static deletePost = async (req, res) => {
    try {
      const status = await PostRepo.deletePost(req.params.postId);
      return res.json(status);
    } catch (e) {
      return res.json({ status: false, error: "Error deleting Post " + e });
    }
  };

  static createPost = async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
      return res
        .status(422)
        .send({ status: false, error: "Please Send All Required Fields" });
    }
    console.log("create post ", req.body);
    try {
      req.user.password = undefined;
      const post = await PostRepo.createPost({
        title,
        body,
        postedBy: req.user,
      });
      return res.send({ status: true, post });
    } catch (e) {
      console.log("error", e);
      return res.json({ status: false, error: "Error creating Posts : " + e });
    }
  };

  static updatePost = async (req, res) => {
    try {
      const { title, body } = req.body;
      if (!title && !body) {
        return res
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
      const post = await PostRepo.updatePost(req.params.postId, updObj);
      return res.send(post);
    } catch (e) {
      return res.json({ status: false, error: "Error Updating Post " + e });
    }
  };
}

module.exports = PostService;
