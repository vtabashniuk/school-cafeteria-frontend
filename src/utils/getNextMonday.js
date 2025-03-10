import dayjs from "dayjs";

export const getNextMonday = () => {
  const today = new Date(); // поточна дата
  const currentDay = today.getDay(); // день тижня (0 - неділя, 1 - понеділок, ...)

  // Розрахуємо кількість днів до наступного понеділка
  const daysToMonday = (8 - currentDay) % 7; // додаємо 8, щоб врахувати випадок, коли сьогодні понеділок

  // Створимо нову дату для наступного понеділка
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysToMonday);

  return dayjs(nextMonday);
};
