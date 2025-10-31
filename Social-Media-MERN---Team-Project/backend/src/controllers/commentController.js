const Comment = require('../models/Comment');
const Post = require('../models/postModel');

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    if (!text || !postId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = new Comment({
      text,
      post: postId,
      author: userId,
    });

    await comment.save();
    await comment.populate('author', 'name username profilePicture');
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment', error: error.message });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching comments', error: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting comment', error: error.message });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ success: true, message: 'Comment like updated', likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error liking comment', error: error.message });
  }
};
