
import React, { useEffect, useState } from "react";
import { FaCartPlus, FaTrash, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";


const WishlistCard = ({ 
  product, 
  onAddToCart, 
  onDelete
}) => {
  const navigate = useNavigate();
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkIfBestSeller = async () => {
      try {
        const response = await axiosInstance.post("/cart/most-popular", {
          category: product.category || null
        });
        const topProducts = response.data.topProducts || [];
        if (topProducts.length > 0 && topProducts[0]._id === product._id) {
          setIsBestSeller(true);
        }
      } catch (err) {
        console.error("Error checking best seller:", err);
      }
    };

    const checkIfInWishlist = async () => {
      try {
        const response = await axiosInstance.get("/wishlist/user-wishlist");
        if (response.data.products.some(p => p._id === product._id)) {
          setIsInWishlist(true);
        }
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };

    checkIfBestSeller();
    checkIfInWishlist();
  }, [product._id, product.category]);

  const truncateDescription = (desc) => {
    if (!desc) return "";
    return desc.length > 200 ? desc.slice(0, 200) + "..." : desc;
  };

 

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between h-full">
      {isBestSeller && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full z-10">
          <FaCrown className="w-4 h-4" />
        </div>
      )}
      <div 
        onClick={() => navigate(`/products/${product._id}`)} 
        className="flex-1 cursor-pointer"
      >
        <img
          src={product.image?.startsWith("http") ? product.image : "/images/pimage.jpg"}
          alt={product.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600 mt-2 text-sm">
          {truncateDescription(product.description)}
        </p>
        <p className="text-cyan-700 mt-2 font-bold">${product.price}</p>
        {product.category && (
          <p className="text-xs text-gray-500 mt-1">
            Category: {product.category}
          </p>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product._id);
          }} 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-xl"
        >
          <FaCartPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add to Cart</span>
        </button>
        <div className="flex gap-2">
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product._id);
            }} 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl"
          >
            <FaTrash className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;