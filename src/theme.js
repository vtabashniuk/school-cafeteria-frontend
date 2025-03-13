import { createTheme } from "@mui/material/styles";

// Створення глобальної теми
const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif", // Використовуємо Inter як основний шрифт
    h1: {
      fontSize: "2rem",
    },
    h2: {
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
    },
    // Додавайте інші стилі за потреби
  },
  palette: {
    primary: {
      main: "#6190E8", // Основний колір
    },
    secondary: {
      main: "#9c27b0", // Додатковий колір
    },
    background: {
      default: "#ECE9E6", // Колір фону
    },
    spinner: {
      main: "#ECE9E6", // Визначаємо колір для спінера
    },
    text: {
      primary: "#212121", // Колір основного тексту
      secondary: "#757575", // Колір для вторинного тексту
      disabled: "#bdbdbd", // Колір для вимкненого тексту
    },
  },
  components: {
    // Ви можете налаштувати компонент для фонового градієнта
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Додаємо градієнт фону для всього сайту
          background: "linear-gradient(to right, #ECE9E6, #FFFFFF)",
          minHeight: "100vh", // Щоб фон охоплював всю висоту сторінки
        },
      },
    },
  },
});

export default theme;
