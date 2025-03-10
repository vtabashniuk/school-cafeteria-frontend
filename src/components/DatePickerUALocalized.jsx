import React from "react";
import dayjs from "dayjs";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ukUA } from "@mui/x-date-pickers/locales";
import updateLocale from "dayjs/plugin/updateLocale";

const ukrainianLocale =
  ukUA.components.MuiLocalizationProvider.defaultProps.localeText;

dayjs.extend(updateLocale);
dayjs.updateLocale("uk", {
  months: [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ],
});

const DatePickerUALocalized = ({ label, selectedDate, onDateChange }) => {
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={"uk"}
        localeText={ukrainianLocale}
      >
        <DatePicker
          label={label}
          format="DD.MM.YYYY"
          value={selectedDate}
          onChange={onDateChange}
        />
      </LocalizationProvider>
    </>
  );
};

export default DatePickerUALocalized;
