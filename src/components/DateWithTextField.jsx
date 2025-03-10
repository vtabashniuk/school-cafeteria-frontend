import React, { useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";
import { getDayOfWeek, getFormattedDate } from "../utils";

const DateWithTextField = ({ date, label, textData, onChange }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const dayOfWeek = getDayOfWeek(date); // Отримуємо день тижня
  const formattedDate = getFormattedDate(date); // Форматуємо дату

  useEffect(() => {
    if (dayOfWeek !== label) {
      setErrorMessage("Перевірте дату");
    } else {
      setErrorMessage("");
    }
  }, [dayOfWeek, label]);

  return (
    <>
      {/* Заголовок з датою та днем тижня */}
      <Typography variant="h6" gutterBottom>
        {`Меню на: ${formattedDate}, ${dayOfWeek}`}
      </Typography>
      {errorMessage && (
        <Typography color="error" variant="body2">
          {errorMessage}
        </Typography>
      )}
      <TextField
        label={label}
        multiline
        rows={7}
        variant="outlined"
        fullWidth
        value={textData}
        onChange={onChange}
      />
    </>
  );
};

export default DateWithTextField;
