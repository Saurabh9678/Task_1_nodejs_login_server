const router = require("express").Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const { commentOnPost } = require("../Controller/CommentController");

router.route("/").post(isAuthenticatedUser, commentOnPost);

module.exports = router;
