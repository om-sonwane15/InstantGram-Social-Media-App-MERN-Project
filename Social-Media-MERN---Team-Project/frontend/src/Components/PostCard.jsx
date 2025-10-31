import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { getImageUrl } from '../utils/imageUrl';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const CompactPostCard = ({ post, onPostDeleted }) => {
  const user = useSelector((state) => state.user.user);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      const endpoint = isLiked
        ? `/posts/${post._id}/unlike`
        : `/posts/${post._id}/like`;

      const response = await axiosInstance.post(endpoint);

      if (response.data.success) {
        setIsLiked(!isLiked);
        setLikeCount(response.data.likes?.length || 0);
      }
    } catch (error) {
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        const response = await axiosInstance.delete(`/posts/${post._id}`);
        if (response.data.success) {
          toast.success('Post deleted');
          onPostDeleted();
        }
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const imageUrl = getImageUrl(post.image);
  const createdAt = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
        <Link
          to={`/profile/${post.author._id}`}
          className="flex items-center gap-2 flex-1 hover:opacity-80 transition"
        >
          <img
            src={post.author.profilePicture}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-xs truncate">{post.author.name}</p>
            <p className="text-xs text-gray-500">@{post.author.username} • {createdAt}</p>
          </div>
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <MoreHorizontal size={14} className="text-gray-500" />
          </button>

          {showMenu && user?._id === post.author._id && (
            <button
              onClick={() => {
                handleDelete();
                setShowMenu(false);
              }}
              className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-red-600 hover:bg-red-50 transition-all text-xs font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Image - Small */}
      {imageUrl && (
        <div className="w-full bg-gray-200 h-40 overflow-hidden">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="px-3 py-2.5 space-y-2">
        {/* Caption */}
        {post.caption && (
          <p className="text-gray-900 text-xs line-clamp-2">
            <span className="font-bold">{post.author.name}</span> {post.caption}
          </p>
        )}

        {/* Location */}
        {post.location && (
          <p className="text-xs text-gray-600">📍 {post.location}</p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Likes */}
        {likeCount > 0 && (
          <p className="text-xs font-bold text-gray-700">{likeCount} like{likeCount !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all text-xs font-semibold hover:bg-gray-100"
        >
          <Heart
            size={14}
            className={isLiked ? 'fill-red-600 text-red-600' : 'text-gray-700'}
          />
          {likeCount > 0 && <span className="text-gray-700">{likeCount}</span>}
        </button>

        <Link
          to={`/posts/${post._id}`}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-gray-100 transition-all text-xs font-semibold text-gray-700"
        >
          <MessageCircle size={14} />
          {post.comments?.length > 0 && <span>{post.comments.length}</span>}
        </Link>

        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-gray-100 transition-all text-xs font-semibold text-gray-700">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default CompactPostCard;
