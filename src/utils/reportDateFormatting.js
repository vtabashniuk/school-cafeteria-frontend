const dateFlip = (date) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export const reportDateFormatting = (reportData) => {
  if (!reportData) {
    return { reportDateLabel: "", reportDate: "" };
  }

  if (reportData.dateRange) {
    // Звіт за період
    const [start, end] = reportData.dateRange;
    const startDate = start;
    const endDate = end;
    const label = `${dateFlip(startDate)}_${dateFlip(endDate)}`;
    const display = `${startDate} - ${endDate}`;
    return { reportDateLabel: label, reportDate: display };
  }

  // Звіт за поточну дату
  const date = reportData.date;
  const label = dateFlip(date);
  return { reportDateLabel: label, reportDate: date };
};
