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
      main: "#0061F2", // Основний колір
    },
    secondary: {
      main: "#212121", // Додатковий колір
    },
    background: {
      default: "#ece9e6", // Колір фону
    },
    spinner: {
      primary: "#0061F2", // Визначаємо колір для спінера
      secondary: "#800000",
      white: "#FFFFFF",
    },
    text: {
      primary: "#212121", // Колір основного тексту
      secondary: "#757575", // Колір для вторинного тексту
      disabled: "#bdbdbd", // Колір для вимкненого тексту
    },
    textFieldOutline: {
      primary: "#0061F2",
      secondary: "#CCCCCC",
    },
    gradients: {
      redBackground:
        "linear-gradient(to right, #800000 0%, #DC0000 51%, #800000 100%)",
    },
    actionButtons: {
      primary: "#0061F2", // Основний колір кнопок
      secondary: "#DC0000", // Додатковий колір кнопок
    },
  },
  components: {
    // Задаємо стилі для MuiTextField
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0061F2", // При наведенні
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0061F2", // При фокусі
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            "& .MuiTableCell-root": {
              textAlign: "center", // Вирівнюємо текст по центру
            },
          },
        },
      },
    },
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
