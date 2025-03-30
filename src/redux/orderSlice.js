import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Створення замовлення
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Отримання замовлень поточного користувача
export const fetchStudentOrders = createAsyncThunk(
  "order/fetchStudentOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/my");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
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
      // Створення замовлення
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload); // Додаємо нове замовлення в масив
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Отримання замовлень
      .addCase(fetchStudentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchStudentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
