import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCartPlus } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/crud/${id}`);
        setProduct(res.data);
        setFormData({
          title: res.data.title,
          price: res.data.price,
          description: res.data.description,
          image: res.data.image || "",
          category: res.data.category || "",
        });
      } catch (err) {
        toast.error("Product not found");
        navigate("/products");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/review/summary/${id}`);
        setReviews(res.data);
      } catch (err) {
        setReviews(null);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const isDescriptionLong = (desc) => desc && desc.length > 300;
  const getDisplayedDescription = (desc) =>
    isDescriptionLong(desc) && !showFullDescription
      ? `${desc.substring(0, 300)}...`
      : desc;

  const handleAddToCart = async () => {
    try {
      const token = sessionStorage.getItem("userToken");
      if (!token) {
        toast.info("Please log in to add items to your cart.");
        return;
      }

      await axiosInstance.post(
        "/cart",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product added to cart!");
    } catch (err) {
      toast.error("Failed to add product to cart.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axiosInstance.put(`/crud/${id}`, formData);
      setEditMode(false);
      setShowConfirmModal(false);
      setProduct({ ...product, ...formData });
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Error updating product.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/crud/${id}`);
      toast.success("Product deleted.");
      navigate("/products");
    } catch (err) {
      toast.error("Error deleting product.");
    }
  };

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="flex text-md text-gray-500 mb-4">
        <span
          onClick={() => navigate("/products")}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          Products
        </span>
        <span className="mx-2">&gt;</span>
        <span>{product.title}</span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full md:w-2/5">
            <div className="bg-gray-100 rounded-lg p-4">
              <img
                src={
                  editMode
                    ? formData.image || "/images/pimage.jpg"
                    : product.image || "/images/pimage.jpg"
                }
                alt={product.title}
                className="w-full h-96 object-contain"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => setConfirmDeleteModal(true)}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={handleAddToCart}
                className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                <FaCartPlus /> Add to Cart
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-3/5">
            {editMode ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Product Title"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Price"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Description"
                />
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Image URL"
                />
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-cyan-700 text-white px-6 py-2 rounded hover:bg-cyan-800"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
                <div className="flex items-center mb-3 text-sm text-gray-600">
                  {reviews && reviews.averageRating ? (
                    <>
                      <span className="bg-green-600 text-white px-2 py-1 rounded mr-2 text-xs">
                        {parseFloat(reviews.averageRating).toFixed(1)} ★
                      </span>
                      <span>{reviews.reviewers.length}+ Ratings</span>
                    </>
                  ) : (
                    <>
                      <span className="bg-green-600 text-white px-2 py-1 rounded mr-2 text-xs">
                        4.1 ★
                      </span>
                      <span>100+ Ratings</span>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-800">
                    ${product.price}
                  </span>
                  <span className="ml-3 text-gray-400 line-through">
                    ${Math.round(product.price * 1.3)}
                  </span>
                  <span className="ml-2 text-green-600 font-medium">
                    30% off
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">
                    {getDisplayedDescription(product.description)}
                  </p>
                  {isDescriptionLong(product.description) && (
                    <button
                      onClick={toggleDescription}
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>

                <div className="mt-6 text-sm text-gray-700 space-y-2">
                  <div>
                    <strong>Availability:</strong>{" "}
                    <span className="text-green-600">In Stock</span>
                  </div>
                  <div>
                    <strong>Delivery:</strong> Available
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Summary Section */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {reviews ? (
          <>
            <div className="mb-4 text-yellow-500 text-lg">
              Average Rating: {reviews.averageRating} ★
            </div>
            {(showAllReviews
              ? reviews.reviewers
              : reviews.reviewers.slice(0, 3)
            ).map((r, idx) => (
              <div key={idx} className="mb-4 border-b pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src={r.userImage || "/images/dp.jpg"}
                    alt={r.username}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/dp.jpg";
                    }}
                  />
                  <span className="font-medium">{r.username}</span>
                </div>
                <div className="text-yellow-500 mb-1">
                  Rating: {r.rating} ★
                </div>
                <p className="text-gray-700">{r.review}</p>
              </div>
            ))}
            {reviews.reviewers.length > 3 && (
              <button
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="text-blue-600 hover:underline"
              >
                {showAllReviews ? "Show Less Reviews" : "Show More Reviews"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Confirm Save Modal */}
      {showConfirmModal && (
        <Modal
          message="Are you sure you want to save these changes?"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleSaveChanges}
          confirmText="Confirm"
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteModal && (
        <Modal
          message="Are you sure you want to delete this product?"
          onCancel={() => setConfirmDeleteModal(false)}
          onConfirm={handleDelete}
          confirmText="Delete"
          danger
        />
      )}
    </div>
  );
};

// Reusable Modal Component
const Modal = ({
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  danger = false,
}) => (
  <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
      <h2 className="text-lg font-medium mb-4">{message}</h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded text-white ${
            danger
              ? "bg-red-600 hover:bg-red-700"
              : "bg-cyan-700 hover:bg-cyan-800"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default ProductDetail;