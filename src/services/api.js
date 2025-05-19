import axios from "axios";

const baseURL =
  window.location.protocol === "https:"
    ? "https://194.15.46.123:5000"
    : "http://194.15.46.123:5000";

const api = axios.create({
  // baseURL: "http://localhost:5000/api", // Адреса вашого бекенду
  // baseURL: "http://194.15.46.123:5000/api", // Адреса вашого бекенду
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Додаємо інтерцептор для автоматичного додавання токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
