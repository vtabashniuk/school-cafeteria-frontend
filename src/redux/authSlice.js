import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  token: localStorage.getItem("token") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Для включення/вимкнення спінера
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
