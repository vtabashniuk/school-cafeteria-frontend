import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const getOrdersByGroupForToday = createAsyncThunk(
  "report/getOrdersByGroupForToday",
  async (group, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reports/group?group=${group}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersByGroupForToday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByGroupForToday.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getOrdersByGroupForToday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reportSlice.reducer;
