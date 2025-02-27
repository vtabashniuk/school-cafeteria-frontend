import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Отримання всіх користувачів
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Не вдалося отримати користувачів"
      );
    }
  }
);

// Додавання нового користувача
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка додавання користувача"
      );
    }
  }
);

//оновлення балансу
export const updateBalance = createAsyncThunk(
  "user/updateBalance",
  async ({ id, newBalance }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}/updatebalance`, {
        newBalance,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка оновлення балансу"
      );
    }
  }
);

// Редагування користувача
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка оновлення користувача"
      );
    }
  }
);

// Встановлення нового пароля
export const setPassword = createAsyncThunk(
  "users/setPassword",
  async ({ id, password }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}/setpassword`, {
        newPassword: password,
      });
      alert(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка встановлення пароля"
      );
    }
  }
);

// Видалення користувача
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Помилка видалення користувача"
      );
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload.user);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload || "Помилка при створенні користувача";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(setPassword.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateBalance.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })
      .addCase(updateBalance.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, resetLoading } = userSlice.actions;
export default userSlice.reducer;
