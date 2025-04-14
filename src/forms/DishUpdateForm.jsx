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

// Компонент для редагування страви
export const DishUpdateForm = ({ open, dish, onDishUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    dishName: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dish) {
      setFormData({ ...dish });
    } else {
      setFormData({
        dishName: "",
        price: "",
      });
    }
    setError("");
  }, [dish, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Перевірка на додатнє число
    if (name === "price") {
      if (/^\d*$/.test(value) && value > 0) {
        setFormData({ ...formData, [name]: value });
        setError(""); // Очищаємо помилку при правильному введенні
      } else {
        setError("Ціна повинна бути додатнім числом.");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChangeDish = async () => {
    setIsLoading(true);
    setError("");
    if (formData.price <= 0) {
      setError("Ціна повинна бути додатнім числом");
      setIsLoading(false);
      return;
    }

    try {
      await onDishUpdate(dish._id, formData).unwrap();
      setError(""); // очищення помилки після успішного оновлення
    } catch (error) {
      setError(error?.message || "Помилка оновлення страви");
    } finally {
      setIsLoading(false);
    }
    onClose(); // Закриваємо форму після відправки
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Редагування страви</DialogTitle>
      <DialogContent>
        {error && (
          <Alert color="error" variant="outlined">
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
          onClick={handleChangeDish}
          variant="contained"
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
};
