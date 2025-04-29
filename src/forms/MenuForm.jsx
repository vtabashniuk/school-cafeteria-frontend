import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getNextMonday, parseText } from "../utils";
import DatePickerUALocalized from "../components/DatePickerUALocalized";
import DateWithTextField from "../components/DateWithTextField";
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";


dayjs.extend(utc);
dayjs.extend(timezone);

export const MenuForm = ({ open, onClose, onSubmit }) => {
  const nextMonday = dayjs(getNextMonday());
  const [selectedDate, setSelectedDate] = useState(nextMonday);
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMenuData([]);
      setError("");
    }
  }, [open]);

  const workDays = selectedDate
    ? [
        { date: selectedDate, dayName: "Понеділок" },
        ...Array.from({ length: 4 }, (_, index) => ({
          date: dayjs(selectedDate).add(index + 1, "day"),
          dayName: ["Вівторок", "Середа", "Четвер", "Пʼятниця"][index],
        })),
      ]
    : [];

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Збираємо всі введені дані в масив
      const parsedData = menuData
        .map(({ date, textData }) => {
          const dateInEET = dayjs(date).tz("Europe/Kiev").startOf("day");
          const dateWithoutTimeShift = dateInEET.format(
            "YYYY-MM-DDTHH:mm:ss.SSSZ"
          );
          return parseText(textData).map((item) => ({
            ...item, // Це буде dishName і price
            date: dateWithoutTimeShift, // Додаємо відповідну дату
          }));
        })
        .flat(); // використовуємо flat, щоб вийшов один масив страв

      await onSubmit(parsedData);
    } catch (error) {
      setError(error.message || "Помилка при відправці даних меню.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      sx={{
        "& .MuiDialogContent-root": {
          paddingTop: 2,
        },
      }}
    >
      <DialogTitle>Додати меню</DialogTitle>
      <DialogContent sx={{ padding: 2}}>
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
        <DatePickerUALocalized
          label={"Виберіть дату"}
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
        />

        {workDays.map(({ dayName, date }) => (
          <DateWithTextField
            key={dayName}
            date={date}
            label={dayName}
            textData={
              menuData.find((item) => item.date.isSame(date))?.textData || ""
            }
            onChange={(e) =>
              setMenuData((prevMenuData) => {
                // Якщо об'єкт вже є для цієї дати, оновлюємо його
                const updatedMenuData = [...prevMenuData];
                const index = updatedMenuData.findIndex((item) =>
                  item.date.isSame(date)
                );
                if (index !== -1) {
                  updatedMenuData[index].textData = e.target.value;
                } else {
                  updatedMenuData.push({ date, textData: e.target.value });
                }
                return updatedMenuData;
              })
            }
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.actionButtons.secondary,
          }}
          disabled={isLoading}
        >
          Закрити
        </Button>
        <Button
          color="primary"
          loading={isLoading}
          loadingPosition="end"
          onClick={handleSubmit}
          variant="contained"
        >
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};
