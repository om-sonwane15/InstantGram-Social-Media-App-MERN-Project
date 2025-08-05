// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { FaEdit } from "react-icons/fa";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/users/profile");
        setUser(response.data);

        dispatch(
          setUserData({
            username: response.data.username,
            image: response.data.image?.startsWith("http")
              ? response.data.image
              : `http://localhost:5000${response.data.image}`,
          })
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }
    setFile(file);
    setImageUrl("");
  };

  const handleImageUpdate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (imageUrl.trim()) formData.append("imageUrl", imageUrl);
    if (newUsername.trim()) formData.append("username", newUsername);

    try {
      const response = await axiosInstance.put("/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data);
      setShowModal(false);
      setFile(null);
      setImageUrl("");
      setNewUsername("");

      dispatch(
        setUserData({
          username: response.data.username,
          image: response.data.image?.startsWith("http")
            ? response.data.image
            : `http://localhost:5000${response.data.image}`,
        })
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] flex flex-col items-center gap-4 relative group">
        <div className="relative" onClick={() => setShowModal(true)}>
          <img
            src={
              user?.image
                ? user.image.startsWith("http")
                  ? user.image
                  : `http://localhost:5000${user.image}`
                : "/images/dp.jpg"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-cyan-500"
          />

          <div className="absolute inset-0 bg-cyan-700/60 bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
            <FaEdit className="text-white text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-500">{user.isAdmin ? "Admin" : "Regular User"}</p>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
        >
          Back to Home
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 relative w-[90%] max-w-md">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
            >
              ✕
            </button>
            <form
              onSubmit={handleImageUpdate}
              className="flex flex-col gap-4"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <h2 className="text-xl cursor-pointer font-semibold mb-2">Update Profile</h2>

              <div
                className="border-2 border-dashed p-4 rounded cursor-pointer text-center"
                onClick={() => fileInputRef.current.click()}
              >
                {file ? <p>{file.name}</p> : <p>Drag and drop an image here, or click to select</p>}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={handleFileChange}
                />
              </div>

              <input
                type="text"
                placeholder="Or paste Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border p-2 rounded"
              />

              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
