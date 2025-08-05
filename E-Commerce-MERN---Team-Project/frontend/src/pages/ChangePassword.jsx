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
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/changePassword", {
        oldPassword,
        newPassword,
      });

      if (response.data.msg === "Password changed successfully") {
        setSuccessMessage("Password changed successfully!");
        setShowPopup(true);
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.msg || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while changing the password.");
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
    <div className="mb-4 sm:mb-6 relative">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FaLock size={14} className="sm:w-4 sm:h-4" />
        </div>
        <input
          type={show ? "text" : "password"}
          id={id}
          className="w-full p-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm sm:text-base"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          required
        />
        <button 
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
        >
          {show ? <FaEyeSlash size={16} className="sm:w-5 sm:h-5" /> : <FaEye size={16} className="sm:w-5 sm:h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
          <div className="p-5 sm:p-7 lg:p-8">
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-2">
              Change Password
            </h2>
            <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-2">
              Update your password to keep your account secure
            </p>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {renderPasswordField(
                "Current Password", 
                oldPassword, 
                setOldPassword, 
                showOld, 
                setShowOld, 
                "oldPassword",
                "Enter your current password"
              )}
              
              {renderPasswordField(
                "New Password", 
                newPassword, 
                setNewPassword, 
                showNew, 
                setShowNew, 
                "newPassword",
                "Enter a strong password"
              )}
              
              {renderPasswordField(
                "Confirm New Password", 
                confirmPassword, 
                setConfirmPassword, 
                showConfirm, 
                setShowConfirm, 
                "confirmPassword",
                "Repeat your new password"
              )}

              <div className="pt-3 sm:pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-lg text-white font-medium transition-all duration-200 text-sm sm:text-base ${
                    isLoading 
                      ? "bg-cyan-400 cursor-not-allowed" 
                      : "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden xs:inline">Processing...</span>
                      <span className="xs:hidden">...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal - Fully Responsive */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md transform transition-all duration-300 scale-100 mx-3">
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-green-100">
                <FaCheck className="text-green-600" size={18} />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-gray-800 mb-2">
                Success!
              </h2>
              <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-2">
                {successMessage}
              </p>
              <div className="text-center">
                <button
                  onClick={closePopup}
                  className="w-full sm:w-auto px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base transform hover:scale-105 active:scale-95"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;