// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {FaEye,FaEyeSlash,FaLock,FaCheck,FaArrowLeft,} from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.message === "Password reset successful") {
        setSuccessMessage("Password has been reset successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(response.data.message || "An unexpected error occurred.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-600">
      <div className="m-10 flex justify-center items-center w-[90%] max-w-6xl rounded-3xl p-1 shadow-2xl bg-gradient-to-b from-[#40cddf] via-[#00768e] to-[#035b73]">
        <div className="w-full max-w-lg mt-20 mb-20 bg-white/5 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 shadow-inner text-white">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate("/")}
              className="flex items-center text-blue-200 hover:text-white transition-colors">
              <FaArrowLeft className="mr-2" /> Back to login
            </button>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
              Reset Your Password</h2>
            <p className="text-blue-100 text-sm"> Please enter your new password below</p>
          </div>
          {error && (
            <div className="bg-red-500/20 p-3 rounded-lg text-red-200 text-sm mb-4">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500/20 p-3 rounded-lg text-green-200 text-sm mb-4 flex items-center gap-2">
              <FaCheck /> {successMessage}
            </div>
          )}
          <div className="mb-4 relative">
            <label htmlFor="newPassword"
              className="block text-sm text-blue-100 font-medium mb-1"> New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input type={showNew ? "text" : "password"}id="newPassword"
                className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/80 text-black"
                value={newPassword}onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"/>
              <button type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600" >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="confirmPassword"
              className="block text-sm text-blue-100 font-medium mb-1" >Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input type={showConfirm ? "text" : "password"}
                id="confirmPassword" className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/80 text-black"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"/>
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button onClick={handleReset}disabled={isLoading}
            className={`w-full py-3 mt-4 rounded-lg text-white font-semibold ${
              isLoading ? "bg-blue-400 cursor-not-allowed": "bg-blue-900 hover:bg-blue-800"}`}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;