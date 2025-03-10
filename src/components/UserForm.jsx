import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const UserForm = ({ open, onClose, onSubmit, userRole, initialData }) => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    login: "",
    password: "",
    role: userRole,
    group: "",
    balance: 0,
    isBeneficiaries: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: "" });
    } else {
      setFormData({
        lastName: "",
        firstName: "",
        login: "",
        password: "",
        role: userRole,
        group: "",
        balance: 0,
        isBeneficiaries: false,
      });
    }
    setError(""); // Очищаємо помилку при відкритті
  }, [initialData, open, userRole]); // <-- Додано `open`, щоб очищати поля при відкритті форми

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Якщо це Checkbox, оновлюємо значення через checked
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.login ||
      (!initialData && !formData.password)
    ) {
      setError("Заповніть всі обов'язкові поля");
      return;
    }

    const updatedData = { ...formData };

    if (initialData) {
      delete updatedData.role; // Видаляємо role, щоб сервер не блокував оновлення
    }

    if (!formData.password) delete updatedData.password; // Видаляємо поле, якщо воно пусте

    updatedData.balance = Number(formData.balance);

    try {
      const errorMessage = await onSubmit(updatedData); // Отримуємо можливу помилку
      if (errorMessage) {
        setError(errorMessage); // Встановлюємо помилку у форму
        return;
      }
      setError(""); // Якщо все добре, очищаємо помилки
    } catch (err) {
      setError(err.message || "Помилка при збереженні користувача");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setError(""); // Очистка помилки при закритті
        onClose();
      }}
    >
      <DialogTitle>
        {initialData ? "Редагувати користувача" : "Додати користувача"}
      </DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          margin="dense"
          label="Прізвище"
          name="lastName"
          fullWidth
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Ім’я"
          name="firstName"
          fullWidth
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Логін"
          name="login"
          fullWidth
          value={formData.login}
          onChange={handleChange}
          required
        />
        {!initialData && (
          <TextField
            margin="dense"
            label="Пароль"
            type="password"
            name="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}
        <TextField
          margin="dense"
          label="Група"
          name="group"
          fullWidth
          value={formData.group}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Баланс"
          name="balance"
          type="number"
          fullWidth
          value={formData.balance}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isBeneficiaries"
              checked={formData.isBeneficiaries}
              onChange={handleChange}
            />
          }
          label="Пільговик"
          labelPlacement="start"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Закрити
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? "Зберегти" : "Додати"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
