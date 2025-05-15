const dateFlip = (date) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export const reportDateFormatting = (report) => {
  const reportDateLabel = report?.date
    ? dateFlip(report.date)
    : new Date().toISOString().split("T")[0];
  const reportDate = report?.date
    ? report.date
    : new Date().toLocaleDateString();

  return {
    reportDateLabel,
    reportDate,
  };
};
