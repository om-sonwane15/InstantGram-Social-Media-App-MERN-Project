import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {FaUser,FaLock,FaEnvelope,FaEye,FaEyeSlash,FaArrowLeft,} from "react-icons/fa";

function SignupPage(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMsg("");
    if (!name || !email || !password || !confirmPassword) {
      return setErrorMessage("All fields are required.");
    }
    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match.");
    }
    try {
      await axiosInstance.post("/auth/register", { name, email, password });
      setSuccessMsg("Registered successfully. Please login.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-600">
      <div className="m-10 flex justify-center items-center w-[90%] max-w-6xl rounded-3xl p-1 shadow-2xl bg-gradient-to-b from-[#40cddf] via-[#00768e] to-[#035b73]">
        <div className="w-full max-w-lg mt-20 mb-20 bg-white/5 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 shadow-inner text-white">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate("/")}
              className="flex items-center text-blue-200 hover:text-white font-semibold transition-colors">
              <FaArrowLeft className="mr-2" /> Back to login
            </button>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-white bg-clip-text text-transparent"> Create Account</h1>
            <p className="text-shadow-white text-sm text-blue-100 font-medium">Create your new account</p>
          </div>
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className=" mb-2 pl-1 text-sm font-medium text-white flex items-center gap-2"> Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type="text"value={name}onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"className="w-full pl-12 py-3 rounded-lg bg-white/80 text-black"/>
              </div>
            </div>
            <div>
              <label className="mb-2 pl-1 text-sm font-medium text-white flex items-center gap-2">Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type="email"value={email}onChange={(e) => setEmail(e.target.value)}placeholder="username@gmail.com"
                  className="w-full pl-12 py-3 rounded-lg bg-white/80 text-black"/>
              </div>
            </div>
            <div>
              <label className="mb-2 pl-1 text-sm font-medium text-white flex items-center gap-2"> Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type={showPassword ? "text" : "password"}value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/80 text-black"/>
                <button type="button"onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 pl-1 text-sm font-medium text-white flex items-center gap-2">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}placeholder="Confirm Password"
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/80 text-black"/>
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {errorMessage && (
              <div className="bg-red-500/20 p-3 rounded-lg text-red-200 text-sm font-semibold">
                {errorMessage}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/20 p-3 rounded-lg text-green-200 text-sm font-semibold">
                {successMsg}
              </div>
            )}
            <button type="submit"className="w-full py-3 bg-blue-900 cursor-pointer text-white rounded-lg font-bold transition-transform hover:-translate-y-0.5 shadow-md">
              Register
            </button>
          </form>
          <div className="text-center mt-8 text-sm text-cyan-200 font-medium">Already have an account?{" "}
            <button onClick={() => navigate("/")}
              className="text-white cursor-pointer font-bold hover:text-cyan-200"> Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignupPage;