import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {FaLock,FaEnvelope,FaEye,FaEyeSlash, FaArrowLeft,FaGoogle,FaGithub,FaFacebook} from "react-icons/fa";

function LoginPage({ onLogin }){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleForgotPasswordSubmit = async (e) =>{
    e.preventDefault();
    setErrorMessage("");
    setSuccessMsg("");
    if (!email) return setErrorMessage("Email is required");
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSuccessMsg("Reset email sent to " + email);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };
  const handleLoginSubmit = async (e) =>{
    e.preventDefault();
    setErrorMessage("");
    setSuccessMsg("");
    if (!email || !password)
      return setErrorMessage("Email and password are required");
    try{
      const response = await axiosInstance.post("/auth/login",{
        email,
        password,
      });
      const { token } = response.data;
      sessionStorage.setItem("userToken", token);
      dispatch(setUserData({ email }));
      onLogin();
      navigate("/home");
    } catch (error){
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };
  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMsg("");
  };
// bg-gradient-to-b from-[#40cddf] via-[#00768e] to-[#035b73]
  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-600">
      <div className="m-10 flex justify-center items-center w-[90%] max-w-6xl rounded-3xl p-1 shadow-2xl bg-[url(../images/bubble.jpg)] bg-no-repeat bg-cover">
        <div className="w-full max-w-lg mt-20 mb-20 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-inner text-white">
          {isForgotPassword && (
            <div className="flex items-center mb-6">
              <button onClick={() =>{ setIsForgotPassword(false);
                  clearMessages();
                }}className="flex items-center text-blue-200 hover:text-white transition-colors">
                <FaArrowLeft className="mr-2" /> Back to login
              </button>
            </div>
          )}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">Welcome Back</h1>
            <h1 className="text-3xl font-bold mb-2">
              {isForgotPassword ? "Reset Password" : "Login Page"}
            </h1>
            <p className="text-shadow-white text-sm">
              {isForgotPassword ? "Enter your email to receive a reset link": "Please sign in to your account"}</p>
          </div>
          <form onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleLoginSubmit}className="space-y-5">
            <div>
              <label className="mb-2 pl-1 text-sm font-medium text-white flex items-center gap-2"> Email </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type="email" placeholder="username@gmail.com"value={email}onChange={(e) => setEmail(e.target.value)}
                  required className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/80 text-black"/>
              </div>
            </div>
            {!isForgotPassword && (
              <div>
                <label className=" mb-2 pl-1 text-sm font-medium text-white flex items-center gap-2">Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type={showPassword ? "text" : "password"}placeholder="Enter your password"value={password}
                    onChange={(e) => setPassword(e.target.value)}required className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/80 text-black"/>
                  <button type="button"onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}
            {!isForgotPassword && (
              <div className="text-left text-sm">
                <button type="button"onClick={() => {setIsForgotPassword(true);
                    clearMessages();
                  }} className="pl-1 font-bold cursor-pointer text-cyan-200 hover:text-white" > Forgot password?
                </button>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500/20 p-3 rounded-lg text-red-200 text-sm">
                {errorMessage}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/20 p-3 rounded-lg text-green-200 text-sm">
                {successMsg}
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-blue-900 cursor-pointer text-white rounded-lg font-semibold transition-transform hover:-translate-y-0.5 shadow-md">
              {isForgotPassword ? "Send Reset Link" : "Sign In"}
            </button>
          </form>
          {!isForgotPassword && (
            <>
              <div className="my-6 text-center text-sm text-cyan-200"> or continue with</div>
              <div className="flex justify-center gap-4">
                <button className="p-3 rounded-lg bg-white/10">
                  <FaGoogle className="text-red-400" />
                </button>
                <button className="p-3 rounded-lg bg-white/10">
                  <FaGithub className="text-white" />
                </button>
                <button className="p-3 rounded-lg bg-white/10">
                  <FaFacebook className="text-blue-400" />
                </button>
              </div>
              <div className="text-center mt-8 text-sm text-cyan-200"> Don't have an account?{" "}
                <button onClick={() => {clearMessages();
                    navigate("/signup");
                  }}className="text-white cursor-pointer font-bold hover:text-cyan-200">Register for free</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default LoginPage;