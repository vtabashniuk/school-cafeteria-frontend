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

export const getPeriodOrdersReportByGroup = createAsyncThunk(
  "report/getPeriodOrdersReportByGroup",
  async ({ group, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reports/period-report-by-group`, {
        params: { group, fromDate, toDate },
      });
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

export const getPeriodOrdersReportForCafeteriaByGroup = createAsyncThunk(
  "report/getPeriodOrdersReportForCafeteriaByGroup",
  async ({ group, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports/period-report-for-cafeteria", {
        params: { group, fromDate, toDate },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBalanceHistoryReportByGroup = createAsyncThunk(
  "report/getBalanceHistoryReportByGroup",
  async ({ group, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/reports/balance-history-report-by-group`,
        {
          params: { group, fromDate, toDate },
        }
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
    periodOrdersByGroup: null,
    todayOrdersReportForCafeteria: null,
    periodOrdersReportForCafeteria: null,
    balanceHistoryByGroup: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReportData: (state) => {
      state.todayOrdersByGroup = null; // Очищаємо дані
      state.periodOrdersByGroup = null;
      state.todayOrdersReportForCafeteria = null;
      state.periodOrdersReportForCafeteria = null;
      state.balanceHistoryByGroup = null;
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
        state.error = action.payload.message || "Помилка запиту";
      })
      .addCase(getPeriodOrdersReportByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPeriodOrdersReportByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.periodOrdersByGroup = action.payload;
      })
      .addCase(getPeriodOrdersReportByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Помилка запиту";
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
          state.error = action.payload.message || "Помилка запиту";
        }
      )
      .addCase(getPeriodOrdersReportForCafeteriaByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPeriodOrdersReportForCafeteriaByGroup.fulfilled,
        (state, action) => {
          state.loading = false;
          state.periodOrdersReportForCafeteria = action.payload;
        }
      )
      .addCase(
        getPeriodOrdersReportForCafeteriaByGroup.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload.message || "Помилка запиту";
        }
      )
      .addCase(getBalanceHistoryReportByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBalanceHistoryReportByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceHistoryByGroup = action.payload;
      })
      .addCase(getBalanceHistoryReportByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Помилка запиту";
      });
  },
});

export const { clearReportData, clearError, resetLoading } =
  reportSlice.actions;

export default reportSlice.reducer;
