import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import {
  Bell,
  Lock,
  Eye,
  User,
  Globe,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import Avatar from '../Components/Avatar';

const Settings = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    isPrivate: false,
    allowComments: true,
    allowMessages: true,
    allowFollowRequests: true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    messageNotifications: true,
    emailNotifications: false,
  });

  const handleAccountChange = (field, value) => {
    setAccountSettings({ ...accountSettings, [field]: value });
  };

  const handleSaveAccount = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/users/${user?._id}`, accountSettings);
      if (response.data.success) {
        dispatch(updateUser(accountSettings));
        toast.success('Account settings updated');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'password', label: 'Password', icon: Lock },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menu */}
        <div className="md:col-span-1">
          <div className="card p-0 overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <Avatar src={user?.profilePicture} size="lg" />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={accountSettings.name}
                      onChange={(e) => handleAccountChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => handleAccountChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={accountSettings.bio}
                      onChange={(e) => handleAccountChange('bio', e.target.value)}
                      placeholder="Tell us about yourself"
                      maxLength={500}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {accountSettings.bio.length}/500
                    </p>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={accountSettings.website}
                      onChange={(e) => handleAccountChange('website', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={accountSettings.location}
                      onChange={(e) => handleAccountChange('location', e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveAccount}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          {activeTab === 'privacy' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Privacy & Security</h2>
                <div className="space-y-4">
                  {/* Private Account */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Private Account</p>
                      <p className="text-sm text-gray-500">Control who can see your posts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.isPrivate}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, isPrivate: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Allow Comments */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Allow Comments</p>
                      <p className="text-sm text-gray-500">Let people comment on your posts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowComments}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, allowComments: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Allow Messages */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Allow Direct Messages</p>
                      <p className="text-sm text-gray-500">Let people send you messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowMessages}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, allowMessages: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="pt-6 border-t border-gray-200">
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center gap-2">
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Like Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when someone likes your post</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.likeNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          likeNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Comment Notifications */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Comment Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when someone comments on your post</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.commentNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          commentNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Follow Notifications */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Follow Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when someone follows you</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.followNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          followNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Message Notifications */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Message Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when someone messages you</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.messageNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          messageNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email digests of your activities</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          {activeTab === 'password' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="card p-6 mt-6 border-red-200 bg-red-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
