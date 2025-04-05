import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";

export const UserForm = ({
  open,
  onClose,
  onSubmit,
  userRole,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    login: "",
    password: "",
    role: userRole,
    group: "",
    balance: 0,
    isBeneficiaries: false,
    isActive: true,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        isActive: true,
      });
    }
    setError(""); // Очищаємо помилку при відкритті
  }, [initialData, open, userRole]); // <-- Додано open, щоб очищати поля при відкритті форми

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
    setIsLoading(true);
    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.login ||
      (!initialData && !formData.password)
    ) {
      setError("Заповніть всі обов'язкові поля");
      setIsLoading(false);
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
        setIsLoading(false);
        return;
      }
      setError(""); // Якщо все добре, очищаємо помилки
    } catch (err) {
      setError(err.message || "Помилка при збереженні користувача");
    }
    setIsLoading(false);
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
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
        <TextField
          autoComplete="off"
          fullWidth
          label="Прізвище"
          margin="dense"
          name="lastName"
          onChange={handleChange}
          required
          value={formData.lastName}
          disabled={isLoading}
        />
        <TextField
          autoComplete="off"
          fullWidth
          label="Ім’я"
          margin="dense"
          name="firstName"
          onChange={handleChange}
          required
          value={formData.firstName}
          disabled={isLoading}
        />
        <TextField
          autoComplete="off"
          fullWidth
          label="Логін"
          margin="dense"
          name="login"
          onChange={handleChange}
          required
          value={formData.login}
          disabled={isLoading}
        />
        {!initialData && (
          <TextField
            autoComplete="off"
            fullWidth
            label="Пароль"
            margin="dense"
            name="password"
            onChange={handleChange}
            type="password"
            required
            value={formData.password}
            disabled={isLoading}
          />
        )}
        <TextField
          autoComplete="off"
          fullWidth
          label="Група"
          margin="dense"
          name="group"
          onChange={handleChange}
          required
          value={formData.group}
          disabled={isLoading}
        />
        <TextField
          autoComplete="off"
          fullWidth
          label="Баланс"
          margin="dense"
          name="balance"
          type="number"
          value={formData.balance}
          required
          onChange={handleChange}
          disabled={isLoading}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isBeneficiaries}
              name="isBeneficiaries"
              onChange={handleChange}
            />
          }
          label="Пільговик"
          labelPlacement="start"
          disabled={isLoading}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              name="isActive"
              onChange={handleChange}
            />
          }
          label="Активний"
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
          onClick={handleSubmit}
          color="primary"
          loading={isLoading}
          loadingPosition="end"
          variant="contained"
        >
          {initialData ? "Зберегти" : "Додати"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
