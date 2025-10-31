import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Heart, MessageCircle, UserPlus, Trash2 } from 'lucide-react';
import Avatar from '../Components/Avatar';

const Notifications = () => {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, likes, comments, follows
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    // Mock notifications
    setTimeout(() => {
      setNotifications([
        {
          _id: '1',
          type: 'like',
          sender: {
            _id: 'user1',
            name: 'Sarah Johnson',
            username: 'sarahjohn',
            profilePicture: 'https://i.pravatar.cc/150?img=1',
          },
          post: {
            _id: 'post1',
            image: 'https://picsum.photos/100/100?random=1',
          },
          timestamp: new Date(Date.now() - 3600000),
          isRead: false,
        },
        {
          _id: '2',
          type: 'comment',
          sender: {
            _id: 'user2',
            name: 'Mike Chen',
            username: 'mikechen',
            profilePicture: 'https://i.pravatar.cc/150?img=2',
          },
          post: {
            _id: 'post2',
            image: 'https://picsum.photos/100/100?random=2',
          },
          message: 'Amazing photo! 🔥',
          timestamp: new Date(Date.now() - 7200000),
          isRead: false,
        },
        {
          _id: '3',
          type: 'follow',
          sender: {
            _id: 'user3',
            name: 'Emma Wilson',
            username: 'emmaw',
            profilePicture: 'https://i.pravatar.cc/150?img=3',
          },
          timestamp: new Date(Date.now() - 86400000),
          isRead: true,
        },
        {
          _id: '4',
          type: 'like',
          sender: {
            _id: 'user4',
            name: 'John Doe',
            username: 'johndoe',
            profilePicture: 'https://i.pravatar.cc/150?img=4',
          },
          post: {
            _id: 'post3',
            image: 'https://picsum.photos/100/100?random=3',
          },
          timestamp: new Date(Date.now() - 172800000),
          isRead: true,
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-600" />;
      case 'comment':
        return <MessageCircle size={20} className="text-blue-600" />;
      case 'follow':
        return <UserPlus size={20} className="text-green-600" />;
      default:
        return null;
    }
  };

  const getNotificationMessage = (notif) => {
    switch (notif.type) {
      case 'like':
        return `liked your post`;
      case 'comment':
        return `commented: "${notif.message}"`;
      case 'follow':
        return `started following you`;
      default:
        return 'interacted with you';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'likes', 'comments', 'follows'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === 'likes' ? 'like' : f === 'comments' ? 'comment' : f === 'follows' ? 'follow' : 'all')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                filter === (f === 'likes' ? 'like' : f === 'comments' ? 'comment' : f === 'follows' ? 'follow' : 'all')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleMarkAsRead(notification._id)}
              className={`card p-4 flex items-center gap-4 cursor-pointer transition hover:bg-gray-50 ${
                !notification.isRead ? 'border-l-4 border-blue-600 bg-blue-50' : ''
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Avatar */}
              <Avatar src={notification.sender.profilePicture} size="md" />

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">
                    {notification.sender.name}
                  </span>
                  {' '}
                  <span className="text-gray-600">
                    {getNotificationMessage(notification)}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {timeAgo(notification.timestamp)}
                </p>
              </div>

              {/* Post Preview */}
              {notification.post && (
                <img
                  src={notification.post.image}
                  alt="Post"
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
              )}

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notification._id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
