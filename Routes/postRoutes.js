const router = require("express").Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const { createPost, getPosts } = require("../Controller/PostController");

router
  .route("/")
  .post(isAuthenticatedUser, createPost)
  .get(isAuthenticatedUser, getPosts);

module.exports = router;
