// App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPassword from "./pages/ResetPassword";

// Placeholder components for future pages (can be removed or replaced)
import Home from "./pages/Home";
import UserPosts from "./pages/UserPosts";
import ChangePassword from "./pages/ChangePassword"


import Layout from "./Components/Layout";

const SESSION_TIMEOUT = 60 * 60 * 1000;

const isTokenPresent = () => !!sessionStorage.getItem("userToken");

const logout = () => {
  sessionStorage.removeItem("userToken");
};

const ProtectedRoute = ({ children }) => {
  return isTokenPresent() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenPresent());
  const location = useLocation();

  useEffect(() => {
    if (!isTokenPresent()) {
      setIsAuthenticated(false);
      logout();
    }
  }, [location]);

  useEffect(() => {
    // Session timeout auto-logout
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        logout();
        setIsAuthenticated(false);
        alert("Session expired. Please log in again.");
      }, SESSION_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <ToastContainer
        position={window.innerWidth < 768 ? "bottom-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="myposts" element={<UserPosts/>} />
                  <Route path="changePassword" element={<ChangePassword/>} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};
export default App;