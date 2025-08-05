const Post = require('../models/postModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Create a Post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) return res.status(400).json({ msg: 'Title and content are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const post = new Post({ title, content, user: userId });

    if (req.file) {
      const userFolder = path.join(__dirname, '..', 'uploads', 'users', user.email, 'posts');

      // Create folder if it doesn't exist
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      // Save image inside user's post folder
      const imagePath = path.join(userFolder, req.file.filename);
      fs.renameSync(req.file.path, imagePath);

      post.image = `/uploads/users/${user.email}/posts/${req.file.filename}`;
    }

    await post.save();
    res.status(201).json({ msg: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ msg: 'Error creating post' });
  }
};

// displays all the particular users posts
const getAllPostsOfUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).populate('user', 'name profilePicture');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching posts' });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name profilePicture');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ msg: 'Error fetching posts' });
  }
};

// Get a single post
const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ msg: 'Invalid Post ID' });
    }

    const post = await Post.findById(postId).populate('user', 'name profilePicture');

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching post' });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { postId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    if (req.file) {
      const user = await User.findById(req.user.id);
      const userFolder = path.join(__dirname, '..', 'uploads', 'users', user.email, 'posts');

      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      if (post.image) {
        const oldImagePath = path.join(__dirname, '..', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const newImagePath = path.join(userFolder, req.file.filename);
      fs.renameSync(req.file.path, newImagePath);
      post.image = `/uploads/users/${user.email}/posts/${req.file.filename}`;
    }

    await post.save();
    res.status(200).json({ msg: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating post:', error.message);
    res.status(500).json({ msg: 'Error updating post' });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.deleteOne();
    res.status(200).json({ msg: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ msg: 'Error deleting post' });
  }
};


module.exports = { createPost, getAllPostsOfUser, getSinglePost, updatePost, deletePost,getAllPosts };
