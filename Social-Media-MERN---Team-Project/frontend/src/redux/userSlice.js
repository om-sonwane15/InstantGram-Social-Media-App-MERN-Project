import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log('🔄 Redux: Setting user to', action.payload?.name);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearUser: (state) => {
      console.log('🔄 Redux: Clearing user');
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, updateUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
