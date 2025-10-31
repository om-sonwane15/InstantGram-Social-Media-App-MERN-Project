import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { getImageUrl } from '../utils/imageUrl';
import {
  Edit2,
  MapPin,
  Link as LinkIcon,
  Settings,
  Heart,
  MessageCircle,
  Grid,
  Share2,
  ArrowLeft,
} from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setProfileUser({
        _id: userId,
        name: 'John Cena',
        username: 'johncena',
        bio: '💪 Champion | "You can\'t see me!"',
        location: 'Boston, USA',
        website: 'https://johncena.com',
        profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/John_Cena_2014.jpg/1200px-John_Cena_2014.jpg',
        followers: Array(5234).fill(null),
        following: Array(789).fill(null),
      });
      setIsFollowing(false);
    } catch (error) {
      console.error('Failed to fetch profile');
      toast.error('Failed to load profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setUserPosts(
        Array(9).fill(null).map((_, i) => ({
          _id: i,
          image: `https://picsum.photos/300/300?random=${i}`,
          caption: `Post ${i + 1}`,
          likes: Array(Math.floor(Math.random() * 500) + 100).fill(null),
          comments: Array(Math.floor(Math.random() * 50) + 10).fill(null),
        }))
      );
    } catch (error) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      toast.error('Failed to toggle follow');
    }
  };

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          <span className="font-semibold text-sm">Back</span>
        </button>
        {isOwnProfile && (
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-all">
            <Settings size={16} />
          </button>
        )}
      </div>

      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Profile Section */}
      <div className="max-w-2xl mx-auto px-4">
        {/* Avatar & Info */}
        <div className="flex gap-4 -mt-16 mb-4">
          <img
            src={profileUser.profilePicture}
            alt={profileUser.name}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg flex-shrink-0"
          />
          <div className="flex-1 pt-4">
            <h1 className="text-1xl font-bold text-gray-900">{profileUser.name}</h1>
            <p className="text-gray-900 text-m">@{profileUser.username}</p>
            {profileUser.bio && <p className="text-gray-700 text-sm mt-1">{profileUser.bio}</p>}
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profileUser.location && (
            <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full text-xs">
              <MapPin size={14} />
              <span>{profileUser.location}</span>
            </div>
          )}
          {profileUser.website && (
            <a
              href={profileUser.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs hover:bg-blue-100"
            >
              <LinkIcon size={14} />
              <span>Website</span>
            </a>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mb-6">
          {isOwnProfile ? (
            <>
              <button className="px-5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-md transition-all flex items-center gap-2 text-sm font-semibold">
                <Edit2 size={14} />
                Edit
              </button>
              <button className="px-5 py-1.5 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-all text-sm font-semibold">
                Share
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-1.5 rounded-full font-semibold transition-all text-sm ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="px-5 py-1.5 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-all text-sm font-semibold flex items-center gap-1">
                <MessageCircle size={14} />
                Chat
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
            <p className="text-gray-600 text-xs font-medium">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">5.2K</p>
            <p className="text-gray-600 text-xs font-medium">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">789</p>
            <p className="text-gray-600 text-xs font-medium">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2 font-semibold flex items-center gap-1 text-sm transition-all ${
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid size={16} />
            Posts
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`pb-2 font-semibold flex items-center gap-1 text-sm transition-all ${
              activeTab === 'liked'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart size={16} />
            Liked
          </button>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full"></div>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-12">
            <Grid size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No posts</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 pb-8">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={getImageUrl(post.image)}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1 text-white font-semibold text-xs">
                    <Heart size={14} className="fill-white" />
                    {post.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-1 text-white font-semibold text-xs">
                    <MessageCircle size={14} />
                    {post.comments?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
