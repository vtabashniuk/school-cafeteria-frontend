import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../utils/logout";

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (expTime <= currentTime) {
        console.log("⏳ Термін дії токена закінчився. Виконується вихід...");
        logout(navigate);
      } else {
        const tokenTimeout = expTime - currentTime;
        const timeout = setTimeout(() => {
          console.log("🔔 Термін дії токена закінчився. Вихід...");
          logout(navigate);
        }, tokenTimeout);
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.log("❌ Помилка перевірки токена:", error);
    }
  });

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       localStorage.removeItem("token"); // Видаляє токен при закритті сайту
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, []);
};

export default useAutoLogout;
