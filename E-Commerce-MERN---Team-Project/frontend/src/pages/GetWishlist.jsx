import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingCart,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import WishlistCard from "../Components/WishlistCard";

const GetWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchWishlist = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/wishlist/user-wishlist", {
        params: { page },
      });
      setWishlist(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist(currentPage);
  }, [currentPage]);

  const handleDeleteProduct = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    try {
      await axiosInstance.post(`/wishlist/remove`, {productId: confirmDeleteId});
      fetchWishlist(currentPage);
      toast.success("Product Removed from wishlist");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axiosInstance.post("/cart", { productId });
      toast.success("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart");
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    // On mobile, show fewer pages
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;
    const addPage = (page) => pages.push({ type: "page", page });
    const addEllipsis = () => pages.push({ type: "ellipsis" });

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3) addEllipsis();
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) addPage(i);
      if (currentPage < totalPages - 2) addEllipsis();
      addPage(totalPages);
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="inline-flex flex-wrap items-center rounded-lg shadow-sm bg-white">
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative px-2 sm:px-4 py-2 flex items-center text-xs sm:text-sm font-medium border-r
              ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-cyan-600"
              }
            `}
            aria-label="Previous page"
          >
            <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          {/* On mobile, just show current page indicator */}
          <span className="sm:hidden px-3 py-2 text-sm">
            {currentPage} / {totalPages}
          </span>
          
          {/* On larger screens, show pagination numbers */}
          <div className="hidden sm:flex">
            {pages.map((item, index) =>
              item.type === "ellipsis" ? (
                <span
                  key={index}
                  className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-500"
                >
                  …
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(item.page)}
                  className={`w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-medium ${
                    item.page === currentPage
                      ? "bg-cyan-600 text-white"
                      : "text-gray-600 hover:text-cyan-600 hover:bg-gray-100"
                  }`}
                >
                  {item.page}
                </button>
              )
            )}
          </div>
          
          <button
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`relative px-2 sm:px-4 py-2 flex items-center text-xs sm:text-sm font-medium border-l
              ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-cyan-600"
              }
            `}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
        <p className="text-sm text-gray-600">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved to your wishlist
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-10 px-4">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FaHeart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Your wishlist is empty</p>
          <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
            Add items to your wishlist to save them for later
          </p>
          <button 
            onClick={() => useNavigate()('/')}
            className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wishlist.map((product, index) => (
            <div key={product._id || index} className="relative">
              <WishlistCard
                product={product}
                onAddToCart={handleAddToCart}
                onDelete={handleDeleteProduct}
              />
            </div>
          ))}
        </div>
      )}

      {renderPagination()}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm">
            <div className="flex items-center mb-4 text-amber-600">
              <FaExclamationTriangle className="w-5 h-5 mr-2" />
              <h2 className="text-lg sm:text-xl font-bold">Confirm Remove</h2>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to remove this item from your wishlist?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTrash className="w-3 h-3 mr-2" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default GetWishlist;