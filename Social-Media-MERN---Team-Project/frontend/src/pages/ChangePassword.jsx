import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaEye, FaEyeSlash, FaLock, FaCheck } from "react-icons/fa";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.data.message === "Password changed successfully") {
        setSuccessMessage("Password changed successfully!");
        setShowPopup(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Unexpected error occurred");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.removeItem("userToken");
    navigate("/login");
  };

  const renderPasswordField = (label, value, setValue, show, setShow, id, placeholder) => (
    <div className="mb-6 relative">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FaLock size={16} />
        </div>
        <input
          type={show ? "text" : "password"}
          id={id}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          required
        />
        <button 
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-7">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Change Password</h2>
            <p className="text-center text-gray-600 mb-8">Make sure your new password is strong and unique.</p>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderPasswordField("Current Password", oldPassword, setOldPassword, showOld, setShowOld, "oldPassword", "Enter your current password")}
              {renderPasswordField("New Password", newPassword, setNewPassword, showNew, setShowNew, "newPassword", "Enter a new strong password")}
              {renderPasswordField("Confirm New Password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, "confirmPassword", "Repeat the new password")}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 
                    ${isLoading ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800"}`}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-cyan-700/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
              <FaCheck className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Success!</h2>
            <p className="text-center text-gray-600 mb-6">{successMessage}</p>
            <div className="text-center">
              <button
                onClick={closePopup}
                className="px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-md"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
