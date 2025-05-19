const dateFlip = (date) => {
  // Перевіряємо, чи date є рядком у форматі DD.MM.YYYY
  if (typeof date !== "string" || !/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
    // Якщо формат некоректний, повертаємо поточну дату у форматі YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export const reportDateFormatting = (reportData) => {
  // Обробка порожнього або некоректного reportData
  if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const label = `${year}-${month}-${day}`;
    const display = `${day}.${month}.${year}`;
    return { reportDateLabel: label, reportDate: display };
  }

  // Обробка масиву (todayOrdersByGroup у CuratorTodayReportByGroupPage)
  if (Array.isArray(reportData) && reportData.length > 0) {
    // Беремо дату з першого елемента масиву
    const firstOrderDate = reportData[0]?.date;
    if (firstOrderDate && typeof firstOrderDate === "string") {
      const label = dateFlip(firstOrderDate);
      return { reportDateLabel: label, reportDate: firstOrderDate };
    }
    // Якщо дата відсутня або некоректна, повертаємо поточну дату
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const label = `${year}-${month}-${day}`;
    const display = `${day}.${month}.${year}`;
    return { reportDateLabel: label, reportDate: display };
  }

  // Обробка звіту за період (dateRange)
  if (reportData.dateRange) {
    const [start, end] = reportData.dateRange;
    if (start && end) {
      const label = `${dateFlip(start)}_${dateFlip(end)}`;
      const display = `${start} - ${end}`;
      return { reportDateLabel: label, reportDate: display };
    }
    // Якщо dateRange некоректний, повертаємо поточну дату
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const label = `${year}-${month}-${day}`;
    const display = `${day}.${month}.${year}`;
    return { reportDateLabel: label, reportDate: display };
  }

  // Обробка звіту за поточну дату (date)
  if (reportData.date) {
    const date = typeof reportData.date === "string" ? reportData.date : null;
    if (date && /^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      const label = dateFlip(date);
      return { reportDateLabel: label, reportDate: date };
    }
  }

  // Запасний варіант для неочікуваних даних
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const label = `${year}-${month}-${day}`;
  const display = `${day}.${month}.${year}`;
  return { reportDateLabel: label, reportDate: display };
};