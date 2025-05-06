import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const getTodayOrdersByGroup = createAsyncThunk(
  "report/getTodayOrdersByGroup",
  async (group, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/reports/today-report-by-group?group=${group}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTodayOrdersReportForCafeteriaByGroup = createAsyncThunk(
  "report/getTodayOrdersReportForCafeteriaByGroup",
  async (group, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/reports/today-report-for-cafeteria?group=${group}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    todayOrdersByGroup: null,
    todayOrdersReportForCafeteria: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReportData: (state) => {
      state.todayOrdersByGroup = null; // Очищаємо дані
      state.todayOrdersReportForCafeteria = null; // Очищаємо дані
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodayOrdersByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodayOrdersByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.todayOrdersByGroup = action.payload;
      })
      .addCase(getTodayOrdersByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getTodayOrdersReportForCafeteriaByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTodayOrdersReportForCafeteriaByGroup.fulfilled,
        (state, action) => {
          state.loading = false;
          state.todayOrdersReportForCafeteria = action.payload;
        }
      )
      .addCase(
        getTodayOrdersReportForCafeteriaByGroup.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { clearReportData, clearError, resetLoading } =
  reportSlice.actions;

export default reportSlice.reducer;
