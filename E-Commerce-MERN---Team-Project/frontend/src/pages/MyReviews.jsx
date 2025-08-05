import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsStarFill, BsStar } from "react-icons/bs";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editedData, setEditedData] = useState({ rating: "", review: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/review/my-reviews");
      setReviews(res.data);

    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this review?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss()} className="px-2 py-1 text-sm bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await axiosInstance.delete("/review/delete-review", {
                  data: { reviewId }
                });
                toast.success("Review deleted successfully");
                setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
              } catch (err) {
                toast.error("Failed to delete review");
              }
            }}
            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setEditedData({ rating: review.rating.toString(), review: review.review });
  };

  const closeEditModal = () => {
    setEditingReview(null);
    setEditedData({ rating: "", review: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingReview || !editingReview.reviewId) {
      toast.error("Invalid review data");
      return;
    }

    try {
      await axiosInstance.put("/review/update-review", {
        reviewId: editingReview.reviewId,
        rating: parseInt(editedData.rating),
        review: editedData.review
      });
      toast.success("Review updated successfully");
      fetchReviews();
      closeEditModal();
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) =>
          i <= rating ? (
            <BsStarFill key={i} className="text-amber-400" />
          ) : (
            <BsStar key={i} className="text-gray-300" />
          )
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center shadow-sm">
          <p className="text-lg text-gray-600">You haven't written any reviews yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.reviewId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={
                  review.productImage?.startsWith("http")
                    ? review.productImage
                    : review.productImage
                      ? `http://localhost:5000/${review.productImage.replace(/\\/g, "/")}`
                      : "/images/pimage.jpg"
                }
                alt={review.productTitle}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <h2 className="text-xl font-semibold">{review.productTitle}</h2>
                  <p className="text-gray-600 font-medium">${review.productPrice}</p>
                </div>

                {renderStarRating(review.rating)}
                <p className="text-gray-700 my-4 line-clamp-3">{review.review}</p>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(review)} title="Edit">
                      <FiEdit2 className="text-blue-500" />
                    </button>
                    <button onClick={() => handleDelete(review.reviewId)} title="Delete">
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Review</h2>
              <button onClick={closeEditModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">Rating</label>
                <select
                  value={editedData.rating}
                  onChange={(e) => setEditedData({ ...editedData, rating: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num > 1 && "s"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">Review</label>
                <textarea
                  value={editedData.review}
                  onChange={(e) => setEditedData({ ...editedData, review: e.target.value })}
                  className="w-full p-2 border rounded h-28"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeEditModal} className="bg-gray-200 px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
