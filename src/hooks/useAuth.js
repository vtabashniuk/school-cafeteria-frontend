// useAuth.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { getMe } from "../redux/userSlice";
import api from "../services/api";

const useAuth = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoadingState] = useState(false);

  const loginUser = async (login, password) => {
    setError(""); // Скидаємо помилку
    setLoadingState(true); // Встановлюємо стан завантаження в true

    try {
      const response = await api.post("/auth/login", { login, password });
      dispatch(setUser(response?.data)); // Оновлюємо Redux state з новими даними користувача
      dispatch(getMe()).unwrap();

      switch (response?.data?.user?.role) {
        case "admin":
          return "/admin";
        case "curator":
          return "/curator";
        case "student":
          return "/student";
        default:
          return "/";
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Помилка авторизації");
      setLoadingState(false);
    } finally {
      setLoadingState(false); // Завершуємо завантаження
    }
  };

  return { loginUser, error, loading };
};

export default useAuth;
