import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { Search, UserPlus, UserCheck, Flame, Sparkles, Filter } from 'lucide-react';

const Explore = () => {
  const user = useSelector((state) => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');

  const mockUsers = [
    {
      _id: 1,
      name: 'Sarah Designer',
      username: 'sarahdesigner',
      bio: 'UI/UX Designer | Creative Thinker',
      profilePicture: 'https://i.pravatar.cc/150?img=1',
      followers: Array(3421).fill(null),
      isFollowing: false,
    },
    {
      _id: 2,
      name: 'Mike Developer',
      username: 'mikedev',
      bio: 'Full Stack Developer | Tech Enthusiast',
      profilePicture: 'https://i.pravatar.cc/150?img=2',
      followers: Array(5234).fill(null),
      isFollowing: false,
    },
    {
      _id: 3,
      name: 'Emma Content',
      username: 'emmacontent',
      bio: 'Content Creator | Photographer',
      profilePicture: 'https://i.pravatar.cc/150?img=3',
      followers: Array(8923).fill(null),
      isFollowing: true,
    },
    {
      _id: 4,
      name: 'Alex Influencer',
      username: 'alexinfluencer',
      bio: 'Lifestyle | Travel | Fashion',
      profilePicture: 'https://i.pravatar.cc/150?img=4',
      followers: Array(12345).fill(null),
      isFollowing: false,
    },
    {
      _id: 5,
      name: 'Lisa Marketing',
      username: 'lisamkt',
      bio: 'Digital Marketing Expert',
      profilePicture: 'https://i.pravatar.cc/150?img=5',
      followers: Array(6789).fill(null),
      isFollowing: false,
    },
    {
      _id: 6,
      name: 'James Artist',
      username: 'jamesart',
      bio: 'Digital Artist | Illustrator',
      profilePicture: 'https://i.pravatar.cc/150?img=6',
      followers: Array(4567).fill(null),
      isFollowing: false,
    },
  ];

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      // Mock search
      const filtered = mockUsers.filter(
        u =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filtered);
      const states = {};
      filtered.forEach(u => {
        states[u._id] = u.isFollowing;
      });
      setFollowingStates(states);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId, isCurrentlyFollowing) => {
    try {
      setFollowingStates(prev => ({
        ...prev,
        [userId]: !isCurrentlyFollowing,
      }));
      toast.success(isCurrentlyFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const displayUsers = searchQuery.length >= 2 ? users : mockUsers.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users, names..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
            />
          </div>

          {/* Filters */}
          {searchQuery.length === 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('trending')}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm flex items-center gap-2 ${
                  activeFilter === 'trending'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Flame size={16} />
                Trending
              </button>
              <button
                onClick={() => setActiveFilter('suggested')}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm flex items-center gap-2 ${
                  activeFilter === 'suggested'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Sparkles size={16} />
                Suggested
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
          </div>
        ) : searchQuery.length < 2 && !users.length ? (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Suggested For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockUsers.map(searchUser => (
                <UserCard
                  key={searchUser._id}
                  user={searchUser}
                  isFollowing={followingStates[searchUser._id] || false}
                  onFollow={() =>
                    handleFollowToggle(searchUser._id, followingStates[searchUser._id] || false)
                  }
                />
              ))}
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-semibold">No users found</p>
            <p className="text-gray-400 text-sm">Try searching for a different username</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(searchUser => (
                <UserCard
                  key={searchUser._id}
                  user={searchUser}
                  isFollowing={followingStates[searchUser._id] || false}
                  onFollow={() =>
                    handleFollowToggle(searchUser._id, followingStates[searchUser._id] || false)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// User Card Component
const UserCard = ({ user, isFollowing, onFollow }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-gray-300">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center mb-4">
        <Link to={`/profile/${user._id}`} className="mb-4">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-md hover:scale-105 transition-transform"
          />
        </Link>
        <Link to={`/profile/${user._id}`} className="hover:opacity-80 transition">
          <p className="font-bold text-gray-900 text-lg">{user.name}</p>
          <p className="text-sm text-gray-600">@{user.username}</p>
        </Link>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">{user.bio}</p>
      )}

      {/* Followers */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          {(user.followers?.length / 1000).toFixed(1)}K followers
        </p>
      </div>

      {/* Follow Button */}
      <button
        onClick={onFollow}
        className={`w-full py-2.5 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
          isFollowing
            ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck size={18} />
            Following
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Follow
          </>
        )}
      </button>
    </div>
  );
};

export default Explore;
