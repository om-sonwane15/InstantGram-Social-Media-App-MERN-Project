import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { User, Lock, UserPlus, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/forget", { username });
      setSuccessMsg("Reset email sent to " + username + "@gmail.com");
      setErrorMessage("");
    } catch (err) {
      setSuccessMsg("");
      setErrorMessage(err.response?.data?.msg || "Something went wrong.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMsg("");

    if (!isLoginMode && password !== confirmPassword) {
      return setErrorMessage("Passwords do not match.");
    }

    if (!isLoginMode && !isPasswordValid(password)) {
      return setErrorMessage("Password must be at least 8 characters and contain a number.");
    }

    try {
      const url = isLoginMode ? "/auth/login" : "/auth/register";
      const payload = isLoginMode ? { username, password } : { username, password, image };
      const response = await axiosInstance.post(url, payload);

      if (isLoginMode) {
        const { token, user } = response.data;
        sessionStorage.setItem("userToken", token);

        dispatch(setUserData({
          username: user.username,
          image: user.image || "/images/dp.jpg",
        }));

        onLogin();
        navigate("/home");
      } else {
        alert("Registered successfully.");
        setIsLoginMode(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header with Back Button for Forgot Password */}
        {isForgotPassword && (
          <div className="flex items-center mb-6">
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMessage("");
                setSuccessMsg("");
              }}
              className="flex items-center text-gray-600 hover:text-cyan-600 transition-colors"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back to login</span>
            </button>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {isForgotPassword ? "Reset Password" : isLoginMode ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isForgotPassword
              ? "Enter your username to receive a reset link"
              : isLoginMode
                ? "Login to access your account"
                : "Sign up to get started"}
          </p>
        </div>

        {/* Login/Signup Toggle */}
        {!isForgotPassword && (
          <div className="relative flex h-14 mb-8 border border-gray-200 rounded-full overflow-hidden shadow-sm">
            <button
              type="button"
              className={`w-1/2 z-10 text-lg font-medium flex items-center justify-center gap-2 transition-colors ${isLoginMode ? "text-white" : "text-gray-600"}`}
              onClick={() => {
                setIsLoginMode(true);
                setIsForgotPassword(false);
                setErrorMessage("");
                setSuccessMsg("");
              }}
            >
              <User size={18} />
              Login
            </button>
            <button
              type="button"
              className={`w-1/2 z-10 text-lg font-medium flex items-center justify-center gap-2 transition-colors ${!isLoginMode ? "text-white" : "text-gray-600"}`}
              onClick={() => {
                setIsLoginMode(false);
                setIsForgotPassword(false);
                setErrorMessage("");
                setSuccessMsg("");
              }}
            >
              <UserPlus size={18} />
              Signup
            </button>
            <div
              className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 transition-all duration-300 ease-in-out ${isLoginMode ? "left-0" : "left-1/2"
                }`}
            ></div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Password Fields */}
          {!isForgotPassword && (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLoginMode && (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Profile Image URL (optional)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Forgot Password Link */}
          {!isForgotPassword && isLoginMode && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setSuccessMsg("");
                  setErrorMessage("");
                }}
                className="text-sm text-cyan-600 hover:text-cyan-800 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Error and Success Messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-center">
              {successMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg text-lg font-medium hover:from-cyan-700 hover:to-cyan-600 focus:ring-4 focus:ring-cyan-300 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {isForgotPassword ? "Send Reset Link" : isLoginMode ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Additional Information */}
        {!isForgotPassword && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setErrorMessage("");
                setSuccessMsg("");
              }}
              className="text-cyan-600 font-medium hover:text-cyan-800 hover:underline transition-colors"
            >
              {isLoginMode ? "Sign up" : "Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;