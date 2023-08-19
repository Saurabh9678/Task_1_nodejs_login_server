const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../Models/postModel");
const Comment = require("../Models/commentModel");

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

exports.getPosts = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const user = req.user;
  const totalPosts = await Post.countDocuments();

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const isMore = skip + posts.length < totalPosts;

  if (posts.length === 0) {
    res.status(200).json({
      success: true,
      data: "No available post",
    });
  }

  let finalPost = posts.map((post) => {
    const numberOfLikes = post.likes.length;
    const numberOfComments = post.comments.length;

    if (numberOfLikes !== 0) {
      const userIdIndex = post.likes.findIndex(
        (id) => id.toString() === user._id.toString()
      );
      if (userIdIndex !== -1) {
        return { ...post, numberOfLikes, isLiked: true, numberOfComments };
      } else {
        return { ...post, numberOfLikes, isLiked: false, numberOfComments };
      }
    } else {
      return { ...post, numberOfLikes, isLiked: false, numberOfComments };
    }
  });

  finalPost = finalPost.map((post) => ({
    ...post._doc,
    numberOfLikes: post.numberOfLikes,
    isLiked: post.isLiked,
    numberOfComments: post.numberOfComments,
  }));

  return res.status(200).json({
    success: true,
    data: { finalPost, isMore },
  });
});

exports.getPostById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  const post = await Post.findById(id);

  if (!post) return next(new ErrorHandler("Post not found", 404));

  const numberOfLikes = post.likes.length;
  const numberOfComments = post.comments.length;
  let finalPost = {};
  if (numberOfLikes !== 0) {
    const userIdIndex = post.likes.findIndex(
      (id) => id.toString() === user._id.toString()
    );
    if (userIdIndex !== -1) {
      finalPost = { ...post, numberOfLikes, isLiked: true, numberOfComments };
    } else {
      finalPost = { ...post, numberOfLikes, isLiked: false, numberOfComments };
    }
  } else {
    finalPost = { ...post, numberOfLikes, isLiked: false, numberOfComments };
  }
  finalPost = {
    ...finalPost._doc,
    numberOfLikes: finalPost.numberOfLikes,
    isLiked: finalPost.isLiked,
    numberOfComments: finalPost.numberOfComments,
  };
  return res.status(200).json({
    success: true,
    data: finalPost,
  });
});

exports.editPost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const { content } = req.body;

  const post = await Post.findById(id);

  if (!post) return next(new ErrorHandler("Post not found", 404));

  post.content = content;

  await post.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    data: post,
  });
});

exports.deletePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }
  if (post.comments.length > 0) {
    await Comment.deleteMany({ postId: id });
  }
  await post.deleteOne({ _id: id });
  return res.status(200).json({
    success: true,
    data: "Post deleted",
  });
});

exports.likePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;

  const post = await Post.findById(id);
  if (!post) {
    return next(new ErrorHandler("Post Not found", 404));
  }

  let message = "";

  const userIdIndex = post.likes.findIndex(
    (id) => id.toString() === user._id.toString()
  );

  if (userIdIndex === -1) {
    post.likes.push(user._id);
    message = "liked";
  } else {
    post.likes.splice(userIdIndex, 1);
    message = "unliked";
  }

  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Post is ${message}`,
  });
});
