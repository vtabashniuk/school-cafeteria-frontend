import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import menuReduser from "./menuSlice";
import orderReducer from "./orderSlice";
import reportReducer from "./reportSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReduser,
    order: orderReducer,
    report: reportReducer,
    user: userReducer,
  },
});

export default store;
