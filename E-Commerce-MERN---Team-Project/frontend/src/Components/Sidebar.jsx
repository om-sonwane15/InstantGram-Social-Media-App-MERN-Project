import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaShoppingBag,
  FaHeart,
  FaTimes,
  FaBoxOpen,
} from "react-icons/fa";
import { SidebarContext } from "../context/SidebarContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useContext(SidebarContext);

  const menuItems = [
    { name: "Products", icon: <FaBoxOpen />, path: "/products" },
    { name: "My Cart", icon: <FaShoppingCart />, path: "/mycart" },
    { name: "My Orders", icon: <FaShoppingBag />, path: "/orders" },
    { name: "My Wishlist", icon: <FaHeart />, path: "/wishlist" },
  ];

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative h-full text-white bg-gradient-to-b from-cyan-900 via-cyan-800 to-cyan-700 w-64`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header with Dashboard & Close Icon */}
        <div className="flex items-center justify-between py-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
            Dashboard
          </h2>
          <button
            className="lg:hidden text-white hover:text-gray-300"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-4 text-lg mt-8">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="hover:bg-cyan-600 transition p-3 rounded-xl cursor-pointer flex items-center"
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
