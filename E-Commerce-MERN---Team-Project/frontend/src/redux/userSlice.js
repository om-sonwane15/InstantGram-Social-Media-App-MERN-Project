import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  image: '/images/dp.jpg',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action) {
      const { username, image } = action.payload;
      state.username = username;
      state.image = image;
    },
    clearUserData(state) {
      state.username = null;
      state.image = '/images/dp.jpg';
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
