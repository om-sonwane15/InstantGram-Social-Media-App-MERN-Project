import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

// EmptyCart Component
const EmptyCart = () => {
  return (
    <div className="text-center mt-20 text-gray-600">
      <p className="text-2xl font-semibold">Your cart is empty.</p>
      <p className="text-lg mt-2">Add products to your cart!</p>
    </div>
  );
};

// MyCartContent Component
const MyCartContent = ({ cartItems, updateQuantity, setShowConfirm, setSelectedProductId }) => {
  return (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const product = item.productId;
        if (!product) return null;

        const productImage = product.image || "/images/pimage.jpg";

        return (
          <div key={item._id} className="bg-white rounded-lg shadow-md flex items-center overflow-hidden">
            <img
              src={productImage}
              alt={product.title}
              className="w-40 h-40 object-cover"
            />
            <div className="flex-1 p-4">
              <h3 className="text-2xl font-bold">{product.title}</h3>
              <p className="text-green-600 text-xl font-semibold mt-1">${product.price || "N/A"}</p>
              <div className="flex items-center mt-2 gap-2">
                <span className="text-sm font-medium">Quantity:</span>
                <button
                  onClick={() => updateQuantity(product._id, "decrease")}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(product._id, "increase")}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={() => {
                  setSelectedProductId(product._id);
                  setShowConfirm(true);
                }}
                className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                <FaTrash /> Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("userToken");
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/cart/view");

      if (res.data && res.data.items) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
      setError(null);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setError("Failed to load your cart. Please try again.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      if (action === "increase") {
        await axiosInstance.post("/cart", { productId });
      } else if (action === "decrease") {
        await axiosInstance.delete("/cart", { data: { productId } });
      }
      await fetchCartItems();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setError(`Failed to ${action} quantity. Please try again.`);
    }
  };

  const handleRemoveItemCompletely = async () => {
    try {
      await axiosInstance.post("/cart/remove-all", { productId: selectedProductId });
      setCartItems(prev => prev.filter(item => item.productId._id !== selectedProductId));
      setShowConfirm(false);
      setSelectedProductId(null);
      setError(null);
    } catch (error) {
      console.error("Failed to remove item completely:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = async () => {
    try {
      const products = cartItems
        .map(item => {
          const product = item.productId;
          return product?._id ? { productId: product._id, quantity: item.quantity } : null;
        })
        .filter(Boolean);

      if (products.length === 0) {
        setError("No valid products in the cart");
        return;
      }

      await axiosInstance.post("/orders/order", { products });
      setOrderSuccess(true);
      setError(null);
      setCartItems([]);

      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.response?.data?.message || "Failed to place order. Please try again.");
      setOrderSuccess(false);
    } finally {
      setShowCheckout(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.productId;
      return product?.price ? total + product.price * item.quantity : total;
    }, 0).toFixed(2);
  };

  const getCurrentDate = () => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getCurrentTime = () => new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    if (token) {
      fetchCartItems();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [cartItems]);

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-20">
          <p className="text-xl">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <MyCartContent
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            setShowConfirm={setShowConfirm}
            setSelectedProductId={setSelectedProductId}
          />

          <div className="flex justify-between items-center mt-6">
            <div className="text-xl font-semibold">Total: ${totalAmount}</div>
            <button
              onClick={() => setShowCheckout(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}

      {/* Confirm Remove Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to remove this item?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveItemCompletely}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Receipt Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <div className="border-b-2 border-gray-200 pb-4 mb-4 text-center">
              <h2 className="text-2xl font-bold">Order Summary</h2>
              <p className="text-gray-500">{getCurrentDate()} at {getCurrentTime()}</p>
            </div>

            <div className="mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const product = item.productId;
                    if (!product) return null;
                    const price = product.price || 0;
                    const subtotal = price * item.quantity;

                    return (
                      <tr key={item._id} className="border-b">
                        <td className="py-2">{product.title}</td>
                        <td className="text-center py-2">{item.quantity}</td>
                        <td className="text-right py-2">${price.toFixed(2)}</td>
                        <td className="text-right py-2">${subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 pt-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>${totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tax:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${totalAmount}</span>
              </div>
            </div>

            <div className="mt-4 p-2 bg-gray-50 rounded text-sm text-gray-600">
              Payment Method: Cash on Delivery
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Message */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-green-500">
              Order Placed Successfully!
            </h2>
            <p className="mb-2">Your order has been placed successfully.</p>
            <p>Redirecting to orders page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;
