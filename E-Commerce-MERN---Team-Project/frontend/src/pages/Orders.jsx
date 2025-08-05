import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { Dialog } from "@headlessui/react";
import { AiFillStar } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [cancelTimers, setCancelTimers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const token = sessionStorage.getItem("userToken");
  const navigate = useNavigate();
  const timerRefs = useRef({});
  const [reviewModal, setReviewModal] = useState({ open: false, product: null });
  const [starRating, setStarRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/orders/status");

      if (res.data.orders) {
        const timers = {};
        res.data.orders.forEach((order) => {
          timers[order._id] = getRemainingCancelTimeMs(order.orderTime);
        });

        setOrders(res.data.orders);
        setCancelTimers(timers);
      } else {
        setError("No orders found");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const res = await axiosInstance.get("/review/my-reviews");
      setUserReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch user reviews:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setIsCanceling(true);
    try {
      const res = await axiosInstance.post("/orders/cancel", { orderId });

      if (res.data.order) {
        const updatedOrders = orders.map((order) =>
          order._id === res.data.order._id ? res.data.order : order
        );
        setOrders(updatedOrders);
        toast.success("Order cancelled successfully.", {
          className: "text-xs sm:text-sm md:text-base",
          style: { fontSize: '0.75rem', maxWidth: '90%', margin: '0 auto' },
        });
      } else {
        toast.error(res.data.message || "Could not cancel order.", {
          className: "text-xs sm:text-sm md:text-base",
          style: { fontSize: '0.75rem', maxWidth: '90%', margin: '0 auto' },
        });
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel the order.", {
        className: "text-xs sm:text-sm md:text-base",
        style: { fontSize: '0.75rem', maxWidth: '90%', margin: '0 auto' },
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const getRemainingCancelTimeMs = (orderTime) => {
    const currentTime = new Date();
    const orderDate = new Date(orderTime);
    const cancelWindow = 2 * 60 * 1000; // 2 minutes
    return orderDate.getTime() + cancelWindow - currentTime.getTime();
  };

  const getRemainingCancelTime = (ms) => {
    if (ms <= 0) return "Time expired";
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fallbackImageUrl = "/images/pimage.jpg";

  const isCancelable = (orderId) => cancelTimers[orderId] > 0;

  const hasReviewedProduct = (productId) => {
    return userReviews.some(review => 
      (review.productId?._id === productId) || 
      (review.productId === productId)
    );
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchUserReviews();
    } else {
      navigate("/login");
    }

    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, [token, navigate]);

  useEffect(() => {
    Object.values(timerRefs.current).forEach(clearInterval);
    timerRefs.current = {};

    orders.forEach((order) => {
      if (order.status === "processing") {
        timerRefs.current[order._id] = setInterval(() => {
          setCancelTimers((prev) => {
            const remaining = getRemainingCancelTimeMs(order.orderTime);

            if (remaining <= 0) {
              clearInterval(timerRefs.current[order._id]);
              setOrders((prevOrders) =>
                prevOrders.map((o) =>
                  o._id === order._id ? { ...o, status: "confirmed" } : o
                )
              );
            }

            return { ...prev, [order._id]: remaining };
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, [orders]);

  const submitReview = async () => {
    if (!starRating) {
      toast.warn("Please select a star rating.", {
        className: "text-xs sm:text-sm md:text-base",
        style: { fontSize: '0.75rem', maxWidth: '90%', margin: '0 auto' },
      });
      return;
    }

    try {
      await axiosInstance.post("/review", {
        productId: reviewModal.product.productId,
        rating: starRating,
        review: reviewText,
      });

      toast.success("Review submitted successfully!", {
        className: "text-xs sm:text-sm md:text-base",
        style: { fontSize: '0.75rem', maxWidth: '90%', margin: '0 auto' },
      });
      setReviewModal({ open: false, product: null });
      setStarRating(0);
      setReviewText("");
      fetchUserReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.", {
        className: "text-xs sm:text-sm md:text-base",
        style: { fontSize: '0.75rem', maxWidth: '90%', margin: '0 auto' },
      });
    }
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 flex justify-center items-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
        <div className="text-sm sm:text-base md:text-lg lg:text-xl animate-pulse">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        toastClassName="text-xs sm:text-sm md:text-base"
        style={{ width: 'auto', maxWidth: '90%' }}
        bodyClassName="text-xs sm:text-sm md:text-base"
      />
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6">My Orders</h1>

      {orders.length > 0 ? (
        orders.map((order) => (
          <motion.div
            key={order._id}
            className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow-md mb-3 md:mb-4 lg:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-2 md:mb-3">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">
                Order #{order._id.slice(-6)}
              </h2>
              <span
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium w-fit
                  ${
                    order.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="mb-2 md:mb-3">
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                Ordered on: {formatDate(order.orderTime)}
              </p>
            </div>

            <div className="mb-2 md:mb-3">
              <h3 className="text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">Order Items:</h3>
              <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 lg:p-4 rounded">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center mb-3 last:mb-0 border-b pb-3 last:border-0 gap-2 sm:gap-3"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex-shrink-0 mx-auto sm:mx-0 sm:mr-3 md:mr-4 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.image || fallbackImageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImageUrl;
                        }}
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <p className="font-medium text-xs sm:text-sm md:text-base">
                        {item.title || "Product Name Unavailable"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    {order.status === "confirmed" && (
                      <div className="text-xs md:text-sm mt-1 sm:mt-0 text-center sm:text-right sm:min-w-[100px] md:min-w-[120px]">
                        {hasReviewedProduct(item.productId) ? (
                          <span className="text-green-600 flex items-center justify-center sm:justify-end">
                            <AiFillStar className="mr-1" /> Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              setReviewModal({ open: true, product: { ...item } })
                            }
                            className="bg-cyan-600 text-white px-2 py-1 sm:px-3 md:px-4 md:py-2 rounded whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                          >
                            Write a Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Dialog
              open={reviewModal.open}
              onClose={() => setReviewModal({ open: false, product: null })}
            >
              <div className="fixed inset-0 bg-cyan-700/40 z-40" aria-hidden="true" />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                <Dialog.Panel className="bg-white rounded-xl max-w-xs sm:max-w-sm md:max-w-md w-full p-3 sm:p-4 md:p-5 lg:p-6 relative z-50">
                  <Dialog.Title className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">
                    Leave a Review
                  </Dialog.Title>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <AiFillStar
                        key={num}
                        size={window.innerWidth < 640 ? 20 : 24}
                        onClick={() => setStarRating(num)}
                        className={`cursor-pointer ${
                          num <= starRating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full border rounded p-2 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base"
                    rows="3"
                    placeholder="Write your thoughts..."
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        setReviewModal({ open: false, product: null })
                      }
                      className="bg-red-600 text-white px-2 py-1 sm:px-3 md:px-4 md:py-2 rounded text-xs sm:text-sm md:text-base cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitReview}
                      className="bg-cyan-600 text-white px-2 py-1 sm:px-3 md:px-4 md:py-2 rounded text-xs sm:text-sm md:text-base hover:bg-cyan-700 cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {order.status === "processing" && isCancelable(order._id) && (
              <motion.div
                className="mt-2 sm:mt-3 md:mt-4 border-t pt-2 sm:pt-3 md:pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 sm:mb-2 gap-1">
                  <span className="font-medium text-xs sm:text-sm md:text-base text-center sm:text-left">Cancel Time Remaining:</span>
                  <span className="text-orange-600 font-medium text-xs sm:text-sm md:text-base text-center sm:text-right">
                    {getRemainingCancelTime(cancelTimers[order._id] || 0)}
                  </span>
                </div>
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className={`${
                    isCanceling
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 rounded-lg transition duration-200 w-full text-xs sm:text-sm md:text-base`}
                  disabled={isCanceling}
                >
                  {isCanceling ? "Canceling..." : "Cancel Order"}
                </button>
                <p className="text-2xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
                  * You can cancel this order within 2 minutes of placing it
                </p>
              </motion.div>
            )}
          </motion.div>
        ))
      ) : (
        <motion.div
          className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm sm:text-base md:text-lg">{error || "You have no orders yet."}</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-3 sm:mt-4 bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-lg transition duration-200 text-xs sm:text-sm md:text-base"
          >
            Browse Products
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Orders;