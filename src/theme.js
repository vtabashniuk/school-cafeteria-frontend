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
      main: "#6190e8", // Основний колір
    },
    secondary: {
      main: "#212121", // Додатковий колір
    },
    background: {
      default: "#ece9e6", // Колір фону
    },
    spinner: {
      main: "#ece9e6", // Визначаємо колір для спінера
    },
    text: {
      primary: "#212121", // Колір основного тексту
      secondary: "#757575", // Колір для вторинного тексту
      disabled: "#bdbdbd", // Колір для вимкненого тексту
    },
    textFieldOutline: {
      primary: "#6190e8",
      secondary: "#cccccc",
    },
  },
  components: {
    // Ви можете налаштувати компонент для фонового градієнта
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Додаємо градієнт фону для всього сайту
          background: "linear-gradient(to right, #ece9e6, #ffffff)",
          minHeight: "100vh", // Щоб фон охоплював всю висоту сторінки
        },
      },
    },
  },
});

export default theme;
