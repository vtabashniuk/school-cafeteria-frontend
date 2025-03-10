import dayjs from "dayjs";

// Функція для отримання дня тижня
export const getDayOfWeek = (date) => {
  const daysOfWeek = [
    "Неділя",
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "Пʼятниця",
    "Субота",
  ];
  return daysOfWeek[dayjs(date).day()];
};
