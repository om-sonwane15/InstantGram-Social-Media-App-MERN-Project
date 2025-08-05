// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { FaCartPlus, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../Components/ProductCard";
import Toolbar from "../Components/Toolbar";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");
  const [showPopular, setShowPopular] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async (page = 1) => {
    try {
      if (showPopular) {
        const res = await axiosInstance.post("/cart/most-popular", { 
          category: appliedCategory || null 
        });
        setProducts(res.data.topProducts || []);
        setTotalPages(1);
      } else {
        const res = await axiosInstance.get("/crud/get-products", {
          params: {
            page,
            q: searchQuery,
            minPrice: appliedMinPrice,
            maxPrice: appliedMaxPrice,
            sortBy,
            category: appliedCategory,
          },
        });
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, sortBy, searchQuery, appliedMinPrice, appliedMaxPrice, appliedCategory, showPopular]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setAppliedCategory("");
    setSortBy("");
    setShowPopular(false);
    setCurrentPage(1);
  };

  const handleDeleteProduct = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/crud/${confirmDeleteId}`);
      fetchProducts(currentPage);
      toast.success("Product deleted successfully");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/crud/create-product", formData);
      setShowModal(false);
      setFormData({ title: "", price: "", description: "", image: "", category: "" });
      fetchProducts(currentPage);
      toast.success("Product created successfully");
    } catch (error) {
      console.error("Failed to add product:", error.response?.data || error.message);
      toast.error("Error submitting product");
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    if (totalPages <= 1 || showPopular) return null;
    const pages = [];
    const maxPagesToShow = 5;
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
        <nav className="inline-flex items-center rounded-lg shadow-sm bg-white">
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative px-4 py-2.5 flex items-center text-sm font-medium border-r
              ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-cyan-600"}
            `}
          >
            <FaChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          {pages.map((item, index) =>
            item.type === "ellipsis" ? (
              <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-500">…</span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(item.page)}
                className={`w-10 h-10 flex items-center justify-center font-medium ${item.page === currentPage
                    ? "bg-cyan-600 text-white"
                    : "text-gray-600 hover:text-cyan-600 hover:bg-gray-100"
                  }`}
              >
                {item.page}
              </button>
            )
          )}
          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative px-4 py-2.5 flex items-center text-sm font-medium border-l
              ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-cyan-600"}
            `}
          >
            Next
            <FaChevronRight className="w-4 h-4 ml-2" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="bg-white shadow-md mb-6 py-4 px-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => {
            setFormData({ title: "", price: "", description: "", image: "", category: "" });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-cyan-700 text-white rounded-xl hover:bg-cyan-800"
        >
          Add Product
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        appliedMinPrice={appliedMinPrice}
        appliedMaxPrice={appliedMaxPrice}
        appliedCategory={appliedCategory}
        setAppliedCategory={setAppliedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearFilters={clearFilters}
        showPopular={showPopular}
        setShowPopular={setShowPopular}
      />

      {/* Products Grid */}
      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={product._id || index} className="relative">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onDelete={handleDeleteProduct}
              />
            </div>
          ))}
        </div>
      )}

      {renderPagination()}

      {/* Modal for Add Product */}
      {showModal && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Product title"
                  required
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Product price"
                  required
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  required
                  className="w-full border px-3 py-2 rounded-xl"
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Product image URL"
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-xl"
                >
                  <option value="">Select Category</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops & Tablets">Laptops & Tablets</option>
                  <option value="Audio & Entertainment">Audio & Entertainment</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Accessories & Other Tech">Accessories & Other Tech</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-700 text-white rounded-xl hover:bg-cyan-800"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Products;