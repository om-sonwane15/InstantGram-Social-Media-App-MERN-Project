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
        const response = await axiosInstance.get("/profile/view-profile");

        dispatch(
          setUserData({
            name: response.data.name,
            email: response.data.email,
            profilePicture: response.data.profilePicture?.startsWith("http")
              ? response.data.profilePicture
              : `http://localhost:9000${response.data.profilePicture}`,
          })
        );
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        sessionStorage.removeItem("userToken");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);
};

export default useFetchUser;
