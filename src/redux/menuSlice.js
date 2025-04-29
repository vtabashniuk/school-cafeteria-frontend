import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const addDish = createAsyncThunk(
  "menus/addDish",
  async (menuData, { rejectedWithValue }) => {
    try {
      const response = await api.post("/menus", menuData);
      return response.data.items;
    } catch (error) {
      return rejectedWithValue(
        error.response?.data?.message || "Помилка додавання страви"
      );
    }
  }
);

export const addFreeSaleDish = createAsyncThunk(
  "menus/addFreeSaleDish",
  async (menuData, { rejectWithValue }) => {
    try {
      const response = await api.post("/menus/freesaledish", menuData);
      return response.data.item;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка додавання страви"
      );
    }
  }
);

export const fetchMenu = createAsyncThunk(
  "menus/fetchMenu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/menus");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Не вдалося отримати меню"
      );
    }
  }
);

export const fetchMenuForToday = createAsyncThunk(
  "menus/fetchMenuForToday",
  async (_, { rejectWithValue }) => {
    try {
      // Передаємо дату в запиті до сервера

      const response = await api.get("/menus/today");
      return response.data; // Повертаємо страви на вказану дату
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Не вдалося отримати меню на сьогодні"
      );
    }
  }
);

export const deleteDish = createAsyncThunk(
  "menus/deleteDish",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/menus/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Помилка видалення страви"
      );
    }
  }
);

export const updateDish = createAsyncThunk(
  "menus/updateDish",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/menus/${id}`, updatedData);
      return response.data; // Повертаємо оновлену страву
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка оновлення страви"
      );
    }
  }
);

const initialState = {
  todayMenu: [],
  list: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menus",
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
      .addCase(addDish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDish.fulfilled, (state, action) => {
        state.list.push(...action.payload);
        state.loading = false;
      })
      .addCase(addDish.rejected, (state, action) => {
        state.error = action.payload || "Помилка при додаванні страви";
        state.loading = false;
      })
      .addCase(addFreeSaleDish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFreeSaleDish.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(addFreeSaleDish.rejected, (state, action) => {
        state.error = action.payload || "Помилка при додаванні страви";
        state.loading = false;
      })
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchMenuForToday.fulfilled, (state, action) => {
        state.todayMenu = action.payload;
      })
      .addCase(fetchMenuForToday.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.list = state.list.filter((dish) => dish._id !== action.payload);
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.error = action.payload || "Помилка при видаленні срави";
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        const updatedDish = action.payload;
        state.list = state.list.map((dish) =>
          dish._id === updatedDish._id ? updatedDish : dish
        );
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.error = action.payload || "Помилка при оновленні страви";
      });
  },
});

export const { clearError, resetLoading } = menuSlice.actions;
export default menuSlice.reducer;
