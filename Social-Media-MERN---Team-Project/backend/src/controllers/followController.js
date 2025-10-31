const User = require('../models/userModel');

// Follow user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId);
    } else {
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      success: true,
      message: isFollowing ? 'User unfollowed' : 'User followed',
      following: currentUser.following,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error following user', error: error.message });
  }
};

// Get followers
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('followers', 'name username profilePicture bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, followers: user.followers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching followers', error: error.message });
  }
};

// Get following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('following', 'name username profilePicture bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, following: user.following });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching following', error: error.message });
  }
};

// Check if following
exports.isFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(userId);

    res.json({ success: true, isFollowing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking follow status', error: error.message });
  }
};
