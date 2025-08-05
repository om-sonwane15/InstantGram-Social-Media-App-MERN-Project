import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // get username
      const username = decoded.username;

      await axiosInstance.post("/auth/reset", {
        token,
        newPassword,
      });

      setSuccess("Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          onClick={handleReset}
          className="w-full p-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
