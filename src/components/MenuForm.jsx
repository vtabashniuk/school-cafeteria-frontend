import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getNextMonday, parseText } from "../utils";
import DatePickerUALocalized from "./DatePickerUALocalized";
import DateWithTextField from "./DateWithTextField";

dayjs.extend(utc);
dayjs.extend(timezone);

const MenuForm = ({ open, onClose, onSubmit }) => {
  const nextMonday = dayjs(getNextMonday());
  const [selectedDate, setSelectedDate] = useState(nextMonday);
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    if (open) {
      setMenuData([]);
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
    console.log("Parsed Menu Data:", parsedData);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <DialogTitle>Додати меню</DialogTitle>
      <DialogContent>
        <DatePickerUALocalized
          label={"Виберіть дату"}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
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
        <Button onClick={onClose} color="secondary">
          Закрити
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuForm;
