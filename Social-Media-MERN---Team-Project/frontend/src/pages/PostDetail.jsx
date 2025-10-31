import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import Avatar from '../Components/Avatar';
import {
  Heart,
  MessageCircle,
  Share,
  Trash2,
  MoreVertical,
  ArrowLeft,
  Send,
} from 'lucide-react';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  // Post state
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postLiked, setPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [showPostMenu, setShowPostMenu] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch post details
  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/posts/${postId}`);
      if (response.data.success) {
        setPost(response.data.post);
        setPostLikes(response.data.post.likes?.length || 0);
        setPostLiked(response.data.post.likes?.includes(user?._id));
        fetchComments();
      }
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await axiosInstance.get(`/comments/${postId}`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  // Like/Unlike post
  const handlePostLike = async () => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      if (response.data.success) {
        setPostLiked(response.data.liked);
        setPostLikes(response.data.likes);
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await axiosInstance.delete(`/posts/${postId}`);
      if (response.data.success) {
        toast.success('Post deleted');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await axiosInstance.post(`/comments/${postId}`, {
        text: commentText,
      });

      if (response.data.success) {
        setComments([response.data.comment, ...comments]);
        setCommentText('');
        toast.success('Comment added');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const response = await axiosInstance.delete(`/comments/${commentId}`);
      if (response.data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [name, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) return `${interval}${name[0]} ago`;
    }
    return 'just now';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg">Post not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const isOwnPost = user?._id === post.author?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Post Details</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <img
                src={post.image}
                alt="Post"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4">
            {/* Author Info */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <Link
                  to={`/profile/${post.author?._id}`}
                  className="flex items-center gap-3 flex-1 hover:opacity-80 transition"
                >
                  <Avatar src={post.author?.profilePicture} size="md" />
                  <div>
                    <p className="font-semibold text-gray-900">{post.author?.name}</p>
                    <p className="text-xs text-gray-500">@{post.author?.username}</p>
                  </div>
                </Link>

                {isOwnPost && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPostMenu(!showPostMenu)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                    {showPostMenu && (
                      <button
                        onClick={handleDeletePost}
                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-red-600 hover:bg-red-50 z-10 flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bio Preview */}
              {post.author?.bio && (
                <p className="text-sm text-gray-600 mb-2">{post.author.bio}</p>
              )}

              {/* Follow Button */}
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Follow
              </button>
            </div>

            {/* Post Info */}
            <div className="card p-4">
              {/* Timestamp */}
              <p className="text-xs text-gray-500 mb-3">
                Posted {timeAgo(post.createdAt)}
              </p>

              {/* Caption */}
              {post.caption && (
                <p className="text-gray-900 text-sm mb-3">{post.caption}</p>
              )}

              {/* Location */}
              {post.location && (
                <p className="text-sm text-gray-600 mb-3">📍 {post.location}</p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="card p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{postLikes}</p>
                <p className="text-xs text-gray-500">Likes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {post.comments?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Comments</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Shares</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card p-4 flex gap-2">
              <button
                onClick={handlePostLike}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition font-medium ${
                  postLiked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart
                  size={18}
                  className={postLiked ? 'fill-current' : ''}
                />
                Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                <Share size={18} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              {/* Add Comment Form */}
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg mb-4">Comments</h3>
                <form onSubmit={handleAddComment} className="flex gap-3">
                  <Avatar src={user?.profilePicture} size="sm" />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {commentsLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No comments yet. Be the first!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="p-4 hover:bg-gray-50 transition">
                      {/* Comment Header */}
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          to={`/profile/${comment.author?._id}`}
                          className="flex items-center gap-2 hover:opacity-80"
                        >
                          <Avatar
                            src={comment.author?.profilePicture}
                            size="xs"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {comment.author?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{comment.author?.username}
                            </p>
                          </div>
                        </Link>
                        {user?._id === comment.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Comment Text */}
                      <p className="text-sm text-gray-900 mb-2">{comment.text}</p>

                      {/* Comment Meta */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {timeAgo(comment.createdAt)}
                        </p>
                        <button className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1">
                          <Heart size={14} />
                          {comment.likes?.length || 0}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Related Posts (Optional) */}
          <div className="hidden lg:block">
            <div className="card p-4">
              <h3 className="font-bold text-lg mb-4">Post by {post.author?.name}</h3>
              <div className="space-y-3">
                {post.author?.bio && (
                  <p className="text-sm text-gray-600">{post.author.bio}</p>
                )}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {post.author?.followers?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {post.author?.following?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
