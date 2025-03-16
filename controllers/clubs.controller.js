const mongoose = require("mongoose");
const userService = require("../services/user.service");
const clubsService = require("../services/clubs.service");
const { validationResult } = require("express-validator");
const Post = require("../models/clubs.model");

module.exports.publishPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, user_email, text, category, image } = req.body;

  // Authenticate user based on email
  const user = await userService.authenticateEmail({ email: user_email });
  if (!user) {
    return res
      .status(400)
      .json({ errors: "User with this email doesn't exist!" });
  }

  // Prepare post data
  const postData = {
    title,
    text,
    category,
    image,
    from: {
      id: user.id,
      name: user.fullname,
      email: user.email,
      image: user.image,
    },
    createdAt: new Date(),
    likes: [], // initially empty
    comments: [], // initially empty
    shares: [], // initially empty
  };

  // Save the post
  const post = await clubsService.createPost(postData);

  res.status(200).json({ message: "Post Submitted!" });
};

module.exports.getPostsByCategory = async (req, res) => {
  try {
    let category = decodeURIComponent(req.params.categoryname).trim();
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch one extra post to check if there's more data
    const posts = await Post.find({ category })
      .skip(skip)
      .limit(Number(limit) + 1) // Fetch 1 extra post to check if there's more
      .sort({ createdAt: -1 });

    // Determine if there's more data
    const hasMore = posts.length > limit;

    // Remove the extra post before sending the response
    if (hasMore) posts.pop();

    res.status(200).json({ data: posts, hasMore });
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getPostsById = async (req, res) => {
  try {
    let postId = req.params.postId;

    // Check if postId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID format" });
    }

    // Fetch the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ data: post });
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const { club_id, user_id } = req.body;

    if (!club_id || !user_id) {
      return res
        .status(400)
        .json({ error: "club_id and user_id are required" });
    }

    if (
      !mongoose.isValidObjectId(club_id) ||
      !mongoose.isValidObjectId(user_id)
    ) {
      return res.status(400).json({ error: "Invalid club_id or user_id" });
    }

    if (!club_id || !user_id) {
      return res
        .status(400)
        .json({ error: "club_id and user_id are required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      club_id,
      { $addToSet: { likes: user_id } }, // Prevent duplicate likes
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post liked successfully", updatedPost });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.unlikePost = async (req, res) => {
  try {
    const { club_id, user_id } = req.body;

    if (!club_id || !user_id) {
      return res
        .status(400)
        .json({ error: "club_id and user_id are required" });
    }

    if (
      !mongoose.isValidObjectId(club_id) ||
      !mongoose.isValidObjectId(user_id)
    ) {
      return res.status(400).json({ error: "Invalid club_id or user_id" });
    }

    if (!club_id || !user_id) {
      return res
        .status(400)
        .json({ error: "club_id and user_id are required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      club_id,
      { $pull: { likes: user_id } }, // Prevent duplicate likes
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post liked successfully", updatedPost });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getLikesForPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    // Validate the post_id format
    if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).json({ error: "Invalid post_id" });
    }

    // Find the post by its ID and populate the likes array with user details
    const post = await Post.findById(post_id).populate("likes", "name email"); // Populate with user details, adjust fields as needed

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Return the likes (users who liked the post)
    res.json(post.likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { club_id, user_email, text } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.isValidObjectId(club_id)) {
      return res.status(400).json({ error: "Invalid club_id !" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text cannot be empty" });
    }

    // Fetch user details
    const user = await userService.authenticateEmail({ email: user_email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new comment object
    const newComment = {
      from: {
        id: user.id,
        name: user.fullname,
        email: user.email,
        image: user.image,
      },
      text,
      createdAt: new Date(),
    };

    // Add comment to the post
    const updatedPost = await Post.findByIdAndUpdate(
      club_id,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Comment added successfully", updatedPost });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
