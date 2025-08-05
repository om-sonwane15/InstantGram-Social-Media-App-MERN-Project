// Update App.js to wrap with SidebarProvider
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import LoginForm from "./pages/LoginForm";
import Home from "./pages/Home";
import Products from "./pages/Products";
import MyCart from "./pages/MyCart";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import MyReviews from "./pages/MyReviews";
import GetWishlist from "./pages/GetWishlist";
import AddressManagement from "./pages/AddressPage";

import Layout from "./Components/layout";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setTimeout(() => {
      logout();
      setIsAuthenticated(false);
      alert("Session expired. Please log in again.");
    }, SESSION_TIMEOUT);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginForm onLogin={handleLogin} />}
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="mycart" element={<MyCart />} />
                <Route path="orders" element={<Orders />} />
                <Route path="changePassword" element={<ChangePassword />} />
                <Route path="profile" element={<Profile />} />
                <Route path="myreviews" element={<MyReviews />} />
                <Route path="addresses" element={<AddressManagement />} />
                <Route path="wishlist" element={<GetWishlist />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;