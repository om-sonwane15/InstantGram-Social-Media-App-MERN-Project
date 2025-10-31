import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import CreatePostModal from '../Components/CreatePostModal';
import PostCard from '../Components/PostCard';
import { Plus, Sparkles, Flame } from 'lucide-react';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/feed');
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Stories Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* User Story */}
            <div className="flex-shrink-0 relative group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-0.5">
               <img
  src="https://media.tenor.com/sGGEsBGkNa8AAAAC/john-cena-you-cant-see-me.gif"
  alt={user?.name || "Profile"}
  className="w-full h-full rounded-full object-cover border-2 border-white"
  onError={(e) => {
    e.target.src = 'https://i.pravatar.cc/150?img=10';
  }}
/>

              </div>
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white">
                <Plus size={12} />
              </div>
              <p className="text-xs text-gray-600 text-center mt-1 max-w-16 truncate">Your story</p>
            </div>

            {/* Mock Stories */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 relative group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                  <img
                    src={`https://i.pravatar.cc/150?img=${i}`}
                    alt={`Story ${i}`}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <p className="text-xs text-gray-600 text-center mt-1 max-w-16 truncate">User {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-2xl hover:bg-gray-150 transition-all cursor-pointer group" onClick={() => setShowCreateModal(true)}>
            <img
              src={user?.profilePicture}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="What's on your mind?"
              onClick={() => setShowCreateModal(true)}
              className="flex-1 bg-transparent text-gray-600 placeholder-gray-500 outline-none text-sm font-medium cursor-pointer"
              readOnly
            />
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all group-hover:scale-110"
            >
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-4 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveFilter('trending')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeFilter === 'trending'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Flame size={16} />
              Trending
            </button>
            <button
              onClick={() => setActiveFilter('following')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'following'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-6">
        <div className="max-w-2xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin" style={{ opacity: 0.1 }}></div>
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <Sparkles className="absolute inset-4 text-blue-600 animate-pulse" />
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center shadow-sm">
              <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-semibold mb-2">No posts yet</p>
              <p className="text-gray-500 mb-4">Follow users to see their amazing content in your feed!</p>
              <button
                onClick={() => window.location.href = '/explore'}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
              >
                Explore Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostDeleted={fetchFeed}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={() => {
            fetchFeed();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Home;
