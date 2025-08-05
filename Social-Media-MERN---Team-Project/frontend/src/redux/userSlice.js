// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  profilePicture: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePicture = action.payload.profilePicture;
    },
    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
