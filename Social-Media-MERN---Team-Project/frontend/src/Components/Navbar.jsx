import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, Search, Bell } from 'lucide-react';
import Avatar from './Avatar';

const Navbar = ({ setSidebarOpen }) => {
  const user = useSelector((state) => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search posts, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Avatar src={user?.profilePicture} size="sm" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
