import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/userSlice';
import axiosInstance from './utils/axiosInstance';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import PostDetail from './pages/PostDetail';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';

// Components
import Layout from './Components/Layout';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [appLoading, setAppLoading] = useState(true);

  // Check if token exists
  const getToken = () => {
    return localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
  };

  // Initialize authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        console.log('🔍 Checking token on app load:', !!token);

        if (token) {
          try {
            // Verify token by fetching user data
            const response = await axiosInstance.get('/auth/me');
            console.log('✅ Auth check response:', response.data);

            if (response.data.success && response.data.user) {
              dispatch(setUser(response.data.user));
              console.log('✅ User authenticated and stored in Redux');
            } else {
              localStorage.removeItem('userToken');
              sessionStorage.removeItem('userToken');
              dispatch(clearUser());
              console.log('❌ Auth check failed, clearing storage');
            }
          } catch (error) {
            console.error('❌ Failed to fetch user:', error);
            localStorage.removeItem('userToken');
            sessionStorage.removeItem('userToken');
            dispatch(clearUser());
          }
        } else {
          console.log('❌ No token found');
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(clearUser());
      } finally {
        setAppLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  console.log('📊 Current state:', { isAuthenticated, user: user?.name, loading: appLoading });

  // Loading screen
  if (appLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* If authenticated, show app routes */}
      {isAuthenticated && user ? (
        <>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/explore"
            element={
              <Layout>
                <Explore />
              </Layout>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/posts/:postId"
            element={
              <Layout>
                <PostDetail />
              </Layout>
            }
          />
          <Route
            path="/messages"
            element={
              <Layout>
                <Messages />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <Notifications />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/change-password"
            element={
              <Layout>
                <ChangePassword />
              </Layout>
            }
          />

          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Redirect to login for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
