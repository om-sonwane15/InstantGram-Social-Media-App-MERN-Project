import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  User,
  LogOut,
  Menu,
} from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch(clearUser());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Heart, label: 'Notifications', path: '/notifications' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 bg-white border-r border-gray-200 flex-col fixed h-full shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Instantgram
          </h1>
          <p className="text-xs text-gray-500 mt-1">Share Your Moments</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl transition-all font-semibold ${
                isActive(path)
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={24} />
              <span className="text-lg">{label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 space-y-2 border-t border-gray-100">
          <button
            onClick={() => navigate(`/profile/${user?._id}`)}
            className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl transition-all font-semibold ${
              location.pathname === `/profile/${user?._id}`
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User size={24} />
            <span className="text-lg">Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all font-semibold"
          >
            <LogOut size={24} />
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-black italic bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Instantgram
          </h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-b border-gray-200 p-3 space-y-1 shadow-lg">
            {navItems.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                navigate(`/profile/${user?._id}`);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
