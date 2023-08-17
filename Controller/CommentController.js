const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Comment = require("../Models/commentModel");
const Post = require("../Models/postModel");

exports.commentOnPost = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { comment, postId } = req.body;

  if (!comment || !postId)
    return next(new ErrorHandler("comment and postId field is empty", 400));

  const data = {
    user: {
      id: user._id,
      name: user.name,
    },
    postId,
    comment,
  };
  const post = await Post.findById(postId);
  if (!post) return next(new ErrorHandler("Post not found", 404));

  const commentData = await Comment.create(data);
  if (!commentData) return next(new ErrorHandler("Server Error", 500));

  post.comments.push(commentData._id);

  await post.save({ validateBeforeSave: false });

  
  res.status(200).json({
    success: true,
    data: {
      commentData,
    },
    message: "Added Comment",
    error: "",
  });
});
