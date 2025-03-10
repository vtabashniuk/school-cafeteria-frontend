import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import menuReduser from "./menuSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReduser,
    user: userReducer,
  },
});

export default store;
