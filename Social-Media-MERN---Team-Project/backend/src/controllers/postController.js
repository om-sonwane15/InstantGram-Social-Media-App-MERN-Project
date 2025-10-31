const Post = require('../models/postModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Create post
exports.createPost = async (req, res) => {
  try {
    const { caption, location, tags } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const post = new Post({
      author: userId,
      image: `/uploads/posts/${req.file.filename}`,
      caption: caption || '',
      location: location || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    });

    await post.save();
    await post.populate('author', 'name username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
  }
};

// Get feed
exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followingIds = [...user.following, userId];
    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', 'name username profilePicture')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username profilePicture' },
      })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching feed', error: error.message });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username profilePicture bio followers')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username profilePicture' },
      });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching post', error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { caption, location, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    if (caption) post.caption = caption;
    if (location) post.location = location;
    if (tags) post.tags = tags.split(',').map(tag => tag.trim());

    await post.save();
    await post.populate('author', 'name username profilePicture');

    res.json({ success: true, message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating post', error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', post.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
  }
};

// Get user posts
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user posts', error: error.message });
  }
};

// Search posts
exports.searchPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide search query' });
    }

    const posts = await Post.find({
      $or: [
        { caption: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('author', 'name username profilePicture')
      .limit(20);

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching posts', error: error.message });
  }
};
