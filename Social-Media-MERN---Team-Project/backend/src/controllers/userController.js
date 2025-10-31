const User = require('../models/userModel');
const Post = require('../models/postModel');
const mongoose = require('mongoose');

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    console.log('🔍 Search query:', q);

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    // Search in name, username, or email
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('_id name username email profilePicture bio followers')
      .lean();

    console.log('✅ Found users:', users.length);

    // Get current user's following list
    const currentUser = await User.findById(req.userId).select('following').lean();

    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: currentUser.following.some(
        followId => followId.toString() === user._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      count: usersWithFollowStatus.length,
      users: usersWithFollowStatus,
    });
  } catch (error) {
    console.error('❌ Search users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};

// Follow user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    console.log('👤 Follow request:', { userId, currentUserId });

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid user ID format:', userId);
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      console.log('❌ Invalid current user ID format:', currentUserId);
      return res.status(400).json({
        success: false,
        message: 'Invalid current user ID format',
      });
    }

    if (userId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    // Fetch both users
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    console.log('🔍 User to follow found:', !!userToFollow, userToFollow?.name);
    console.log('🔍 Current user found:', !!currentUser, currentUser?.name);

    if (!userToFollow) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!currentUser) {
      console.log('❌ Current user not found:', currentUserId);
      return res.status(404).json({
        success: false,
        message: 'Current user not found',
      });
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following.some(
      fId => fId.toString() === userId
    );

    if (isAlreadyFollowing) {
      console.log('❌ Already following');
      return res.status(400).json({
        success: false,
        message: 'Already following this user',
      });
    }

    // Add to following list
    currentUser.following.push(new mongoose.Types.ObjectId(userId));
    // Add to followers list
    userToFollow.followers.push(new mongoose.Types.ObjectId(currentUserId));

    await currentUser.save();
    await userToFollow.save();

    console.log('✅ Follow successful');

    return res.status(200).json({
      success: true,
      message: `Now following ${userToFollow.name}`,
      isFollowing: true,
    });
  } catch (error) {
    console.error('❌ Follow user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to follow user',
      error: error.message,
    });
  }
};

// Unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    console.log('👤 Unfollow request:', { userId, currentUserId });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userId
    );
    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUserId
    );

    await currentUser.save();
    await userToUnfollow.save();

    console.log('✅ Unfollow successful');

    return res.status(200).json({
      success: true,
      message: `Unfollowed ${userToUnfollow.name}`,
      isFollowing: false,
    });
  } catch (error) {
    console.error('❌ Unfollow user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unfollow user',
      error: error.message,
    });
  }
};

// Get feed (posts from followed users)
exports.getUserFeed = async (req, res) => {
  try {
    console.log('📱 Fetching feed for user:', req.userId);

    const currentUser = await User.findById(req.userId).populate('following');

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const followingIds = currentUser.following.map(user => user._id);
    // Include own posts too
    followingIds.push(currentUser._id);

    console.log('📱 Following count:', followingIds.length - 1, 'users');

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', 'name username profilePicture email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name username profilePicture',
        },
      })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('✅ Found', posts.length, 'posts');

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('❌ Get feed error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch feed',
      error: error.message,
    });
  }
};
