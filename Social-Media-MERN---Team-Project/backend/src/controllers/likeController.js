const Like = require('../models/Like');
const Post = require('../models/postModel');
const Comment = require('../models/Comment');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);
    let isLiked = false;

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      await Like.deleteOne({ user: userId, post: postId });
    } else {
      post.likes.push(userId);
      isLiked = true;
      const like = new Like({ user: userId, post: postId });
      await like.save();
    }

    await post.save();

    res.json({
      success: true,
      message: isLiked ? 'Post liked' : 'Like removed',
      liked: isLiked,
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error liking post', error: error.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.likes = post.likes.filter(id => id.toString() !== userId);
    await post.save();
    await Like.deleteOne({ user: userId, post: postId });

    res.json({ success: true, message: 'Like removed', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing like', error: error.message });
  }
};

// Get likes for a post
exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post: postId }).populate('user', 'name username profilePicture');

    res.json({ success: true, likes, count: likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching likes', error: error.message });
  }
};
