import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Отримання всіх користувачів
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users");
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Не вдалося отримати користувачів"
      );
    }
  }
);

// Отримання користувачів певної групм
export const fetchStudentsByGroup = createAsyncThunk(
  "users/fetchStudentsByGroup",
  async (group, { rejectWithValue }) => {
    try {
      const res = await api.get("/users", {
        params: { group },
      });
      return res.data.filter((user) => user.role === "student");
    } catch (error) {
      return rejectWithValue(error.message || "Не вдалося завантажити учнів");
    }
  }
);

//Отримання даних поточного користувача
export const getMe = createAsyncThunk(
  "users/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Помилка при отриманні даних користувача"
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
  async ({ id, newBalance, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}/updatebalance`, {
        newBalance,
        reason,
      });
      return { data: response.data, status: response.status };
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
      const { data, status } = await api.put(`/users/${id}/setpassword`, {
        newPassword: password,
      });
      return { data, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка встановлення пароля"
      );
    }
  }
);

// Зміна пароля
export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/changepassword", {
        oldPassword,
        newPassword,
      });
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка зміни пароля"
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
  currentUser: null,
  groups: [],
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
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // зберігаємо дані користувача
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // зберігаємо повідомлення про помилку
      })
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
      .addCase(fetchStudentsByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStudentsByGroup.rejected, (state, action) => {
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
      .addCase(changePassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
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
