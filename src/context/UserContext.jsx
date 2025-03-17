import { createContext, useContext } from "react";

// Створюємо контекст
export const UserContext = createContext();

// Хук для доступу до контексту
export const useUser = () => useContext(UserContext);
