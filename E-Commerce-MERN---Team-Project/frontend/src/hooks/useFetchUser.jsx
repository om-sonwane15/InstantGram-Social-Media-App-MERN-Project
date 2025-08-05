import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const useFetchUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/users/profile");

        dispatch(
          setUserData({
            username: response.data.username,
            image: response.data.image?.startsWith("http")
              ? response.data.image
              : `http://localhost:5000${response.data.image}`,
          })
        );
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);
};

export default useFetchUser;
