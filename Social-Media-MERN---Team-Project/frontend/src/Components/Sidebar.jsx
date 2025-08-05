import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../redux/userSlice";
import useFetchUser from "../hooks/useFetchUser";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaStar,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useFetchUser();

  const user = useSelector((state) => state.user);

  const logout = () => {
    sessionStorage.removeItem("userToken");
    dispatch(clearUserData());
    navigate("/login");
  };

  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/home" },
    { icon: <FaStar />, label: "My Posts", path: "/myposts" },
    { icon: <FaKey />, label: "Change Password", path: "/changePassword" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
        <h1 className="text-lg font-semibold">Menu</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r p-4 flex flex-col justify-between shadow-md transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex md:min-h-screen`}
      >
        <div>
          {/* User Profile */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={user?.profilePicture || "/images/dp.jpg"}
              onError={(e) => (e.target.src = "/images/dp.jpg")}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-cyan-500 object-cover"
            />
            <span className="mt-2 font-semibold text-gray-700">
              {user?.name || "User"}
            </span>
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {navItems.map(({ icon, label, path }) => (
              <button
                key={label}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false); // Close sidebar on mobile
                }}
                className="flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-md"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Overlay (for mobile when open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
