import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
// Компонент для додавання страви вільного продажу
export const FreeSaleDishForm = ({
  open,
  onDishSubmit,
  onClose,
  selectedDate,
}) => {
  const dateInEET = dayjs(selectedDate).tz("Europe/Kiev").startOf("day");
  const dateWithoutTimeShift = dateInEET.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  const [formData, setFormData] = useState({
    date: dateWithoutTimeShift,
    dishName: "",
    price: "",
    isFreeSale: true,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      date: dateWithoutTimeShift,
      dishName: "",
      price: "",
      isFreeSale: true,
    });
    setError("");
  }, [open, dateWithoutTimeShift]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Перевірка на додатнє число
    if (name === "price") {
      if (/^\d*$/.test(value) && value > 0) {
        setFormData({ ...formData, [name]: value });
        setError(""); // Очищаємо помилку при правильному введенні
      } else {
        setError("Ціна повинна бути додатнім числом");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    if (formData.price <= 0) {
      setError("Ціна повинна бути додатнім числом");
      setIsLoading(false);
      return;
    }

    try {
      await onDishSubmit(formData).unwrap();
      setError("");
    } catch (error) {
      setError(error?.message || "Помилка додавання страви");
    } finally {
      setIsLoading(false);
    }
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Додати страву з вільного продажу</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Страва"
            margin="dense"
            name="dishName"
            onChange={handleChange}
            required
            value={formData.dishName}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Ціна"
            margin="dense"
            name="price"
            onChange={handleChange}
            required
            type="number"
            value={formData.price}
            disabled={isLoading}
          />
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
    </>
  );
};
