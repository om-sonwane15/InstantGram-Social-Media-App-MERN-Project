// Navbar.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../redux/userSlice";
import useFetchUser from "../hooks/useFetchUser";
import { FaBars } from "react-icons/fa";
import { SidebarContext } from "../context/SidebarContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useFetchUser();
  
  const { isOpen, toggleSidebar } = useContext(SidebarContext);

  // Use Redux state to get user data (username and image)
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    dispatch(clearUserData());
    setDropdownOpen(false); // Close dropdown after action
    navigate("/login");
  };

  const handleChangePassword = () => {
    setDropdownOpen(false); // Close dropdown after action
    navigate("/changePassword");
  };
  
  const handleViewProfile = () => {
    setDropdownOpen(false); // Close dropdown after action
    navigate("/profile");
  };
  
  const handleMyReviews = () => {
    setDropdownOpen(false); // Close dropdown after action
    navigate("/myreviews");
  };
  
  const handleManageAddresses = () => {
    setDropdownOpen(false); // Close dropdown after action
    navigate("/addresses");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow z-50">
      <div className="flex items-center h-10"> {/* Fixed height to match profile image */}
        <button 
          className="mr-4 text-cyan-700 lg:hidden cursor-pointer" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars size={24} />
        </button>
        <button
          onClick={() => navigate("/home")}
          className="text-cyan-700 font-semibold text-2xl hover:underline cursor-pointer h-full flex items-center"
        >
          Home
        </button>
      </div>

      <div className="ml-auto relative" ref={dropdownRef}>
        <div
          className="relative group cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={user?.image || "/images/dp.jpg"}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = "/images/dp.jpg";
            }}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500"
          />
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden z-10">
            <div className="px-4 py-2 border-b font-semibold">
              {user.username || "User"}
            </div>

            <button
              onClick={handleViewProfile}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              View Profile
            </button>

            <button
              onClick={handleManageAddresses}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Manage Addresses
            </button>

            <button
              onClick={handleMyReviews}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              My Reviews
            </button>

            <button
              onClick={handleChangePassword}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;