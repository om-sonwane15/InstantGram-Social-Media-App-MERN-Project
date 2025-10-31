import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaPlus,
  FaImage,
  FaCalendarAlt,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", image: null, imageUrl: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/posts/all-user-posts");
      setPosts(res.data);
      toast.success("Posts loaded successfully!");
    } catch (error) {
      console.error("Error fetching posts", error);
      toast.error("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0], imageUrl: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", image: null, imageUrl: "" });
    setEditId(null);
    setIsCreating(false);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      let res;

      // ✅ If user uploaded a file
      if (form.image) {
        const formData = new FormData();
        formData.append("title", form.title.trim());
        formData.append("content", form.content.trim());
        formData.append("image", form.image);
        res = await axiosInstance.post("/posts/new-post", formData);
      }
      // ✅ If user pasted an image URL
      else if (form.imageUrl.trim()) {
        res = await axiosInstance.post("/posts/new-post", {
          title: form.title.trim(),
          content: form.content.trim(),
          image: form.imageUrl.trim(),
        });
      } else {
        toast.error("Please upload an image or paste an image URL.");
        return;
      }

      setPosts([res.data.post, ...posts]);
      resetForm();
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditId(post._id);
    setForm({ title: post.title, content: post.content, image: null, imageUrl: post.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      let res;

      if (form.image) {
        const formData = new FormData();
        formData.append("title", form.title.trim());
        formData.append("content", form.content.trim());
        formData.append("image", form.image);
        res = await axiosInstance.put(`/posts/update-post/${editId}`, formData);
      } else {
        res = await axiosInstance.put(`/posts/update-post/${editId}`, {
          title: form.title.trim(),
          content: form.content.trim(),
          image: form.imageUrl.trim(),
        });
      }

      const updated = res.data.post;
      setPosts(posts.map((post) => (post._id === updated._id ? updated : post)));
      resetForm();
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePost = (postId) => {
    setPendingDeleteId(postId);
    toast.info(
      <div>
        <p className="mb-2 text-sm">Are you sure you want to delete this post?</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleDeletePost(postId)}
            className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600 text-xs"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              setPendingDeleteId(null);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600 text-xs"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/posts/delete-post/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      setPendingDeleteId(null);
      toast.dismiss();
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post", error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getImageUrl = (image) => {
    // ✅ If it's a full URL, return as is
    if (image?.startsWith("http")) return image;
    // ✅ Else build local file path
    return `http://localhost:9000${image}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Posts</h1>
          <p className="text-gray-600 text-sm">Manage and share your thoughts with the world</p>
        </div>

        {/* FORM */}
        {(isCreating || editId) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaEdit className="mr-2 text-blue-500" />
              {editId ? "Edit Post" : "Create New Post"}
            </h2>

            <form onSubmit={editId ? handleUpdatePost : handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Enter your post title..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share your thoughts..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                  disabled={loading}
                />
              </div>

              {/* IMAGE FILE INPUT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaImage className="inline mr-2 text-gray-500" />
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg cursor-pointer"
                  disabled={loading}
                />
              </div>

              {/* IMAGE URL INPUT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLink className="inline mr-2 text-gray-500" />
                  Or Paste Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* PREVIEW */}
              {(form.image || form.imageUrl) && (
                <img
                  src={form.image ? URL.createObjectURL(form.image) : form.imageUrl}
                  alt="Preview"
                  className="w-full max-h-60 object-cover rounded-lg border"
                />
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaCheck className="inline mr-2" />
                  {loading ? "Saving..." : editId ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
                >
                  <FaTimes className="inline mr-2" /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CREATE BUTTON */}
        {!isCreating && !editId && (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <FaPlus className="mr-2 inline" />
              Create New Post
            </button>
          </div>
        )}

        {/* POSTS LIST */}
        <div className="space-y-6">
          {!loading && posts.length === 0 ? (
            <div className="text-center bg-white rounded-xl shadow p-8 border">
              <div className="text-6xl text-gray-300 mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Start sharing your thoughts with your first post!</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                <FaPlus className="mr-2" />
                Create Your First Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
                  {post.createdAt && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(post.createdAt)}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                {post.image && (
                  <img
                    src={getImageUrl(post.image)}
                    alt="Post"
                    className="w-full max-w-md mx-auto sm:mx-0 rounded-lg mb-4"
                  />
                )}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => confirmDeletePost(post._id)}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default UserPosts;
