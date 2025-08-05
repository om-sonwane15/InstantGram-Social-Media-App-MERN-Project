// Home.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import CreatePostModal from "../components/CreatePostModal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts/all-posts");
      setPosts(res.data);
    } catch (error) {
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.user?.profilePicture || "/default-avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{post.user?.name}</span>
            </div>
            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:9000${post.image}`}
                alt="Post"
                className="w-full max-h-[400px] object-cover rounded-lg"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiPlus size={24} />
      </button>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={fetchPosts}
        />
      )}
    </div>
  );
};

export default Home;
