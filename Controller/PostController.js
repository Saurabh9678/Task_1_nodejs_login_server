const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../Models/postModel");

exports.createPost = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { content } = req.body;

  if (!content) return next(new ErrorHandler("Content cannot be empty", 400));

  const data = {
    user: {
      id: user._id,
      name: user.name,
    },
    content,
  };
  //   console.log(data);
  const post = await Post.create(data);
  if (!post) return next(new ErrorHandler("Server Error", 500));

  res.status(200).json({
    success: true,
    data: {
      post,
    },
    message: "Post Created",
    error: "",
  });
});

exports.getPosts = catchAsyncError(async (req, res) => {
  const post = await Post.find().sort({ createdAt: -1 });
  if (post.length === 0) {
    res.status(200).json({
      success: true,
      data: "No available post",
    });
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});
