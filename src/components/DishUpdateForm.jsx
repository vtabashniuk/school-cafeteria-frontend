import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

// Компонент для редагування страви
const DishUpdateForm = ({ open, dish, onDishUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    dishName: "",
    price: "",
  });
  const [error, setError] = useState("");

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
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeDish = async () => {
      try {
      const errorMessage = await onDishUpdate(dish._id, formData);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }
      setError("");
    } catch (error) {
      setError(error?.message || "Помилка оновлення страви");
    }
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Редагування страви</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            margin="dense"
            label="Страва"
            name="dishName"
            fullWidth
            value={formData.dishName}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Ціна"
            name="price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Закрити
          </Button>
          <Button onClick={handleChangeDish} color="primary">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DishUpdateForm;
