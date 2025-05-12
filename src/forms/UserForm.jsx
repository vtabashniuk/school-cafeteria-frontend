import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { groups } from "../constants/groups";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from "@mui/material";

export const UserForm = ({ open, onClose, onSubmit, initialData }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    login: "",
    password: "",
    role: currentUser?.role === "curator" ? "student" : "",
    group: "",
    groups: [], // для куратора
    balance: 0,
    isBeneficiaries: false,
    isActive: true,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: "",
        groups:
          initialData.role === "student"
            ? []
            : [...(initialData.groups || [])].sort(),
      });
    } else {
      setFormData({
        lastName: "",
        firstName: "",
        login: "",
        password: "",
        role: currentUser.role === "curator" ? "student" : "",
        group: "",
        groups: [],
        balance: 0,
        isBeneficiaries: false,
        isActive: true,
      });
    }
    setError(""); // Очищаємо помилку при відкритті
  }, [initialData, open, currentUser?.role]); // <-- Додано open, щоб очищати поля при відкритті форми

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    //обробка вибору груп
    if (
      name === "groups" &&
      type === "checkbox" &&
      formData.role === "curator"
    ) {
      const updatedGroups = checked
        ? [...formData.groups, value]
        : formData.groups.filter((group) => group !== value);
      setFormData({
        ...formData,
        groups: updatedGroups.sort(), // Сортуємо за алфавітом
      });
    } else if (type === "checkbox" || type === "switch") {
      setFormData({
        ...formData,
        [name]: checked,
      });
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
        {currentUser.role === "admin" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="userRoleSelection">Роль</InputLabel>
            <Select
              id="userRoleSelect"
              input={<OutlinedInput label="Роль" />}
              labelId="userRoleSelection"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem key={1} value={"curator"}>
                Куратор
              </MenuItem>
              <MenuItem key={2} value={"student"}>
                Учень
              </MenuItem>
            </Select>
          </FormControl>
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
        {/* вибір кількох груп для куратора */}
        {currentUser.role === "admin" && formData.role === "curator" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="groupSelectionsLabel">Групи</InputLabel>
            <Select
              id="groupSelect"
              input={<OutlinedInput label="Групи" />}
              labelId="groupSelectionsLabel"
              multiple
              name="groups"
              value={formData.groups}
              onChange={handleChange}
              renderValue={(selected) => selected.join(", ")}
              required
            >
              {groups.map((group) => (
                <MenuItem key={group} value={group}>
                  <Checkbox checked={formData.groups.indexOf(group) > -1} />
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* вибір однієї групи для учня */}
        {currentUser.role === "admin" && formData.role === "student" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="studentGroupSelection">Група</InputLabel>
            <Select
              id="studentGroupSelect"
              input={<OutlinedInput label="Група" />}
              labelId="studentGroupSelection"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
            >
              {groups.map((groupItem) => (
                <MenuItem key={groupItem} value={groupItem}>
                  {groupItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {currentUser.role === "curator" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="studentGroupSelection">Група</InputLabel>
            <Select
              id="studentGroupSelect"
              input={<OutlinedInput label="Група" />}
              labelId="studentGroupSelection"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
            >
              {currentUser.groups.map((groupItem) => (
                <MenuItem key={groupItem} value={groupItem}>
                  {groupItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {((currentUser.role === "admin" && formData.role === "student") ||
          currentUser.role === "curator") && (
          <>
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
              margin="dense"
              sx={{ mr: 2 }}
              disabled={isLoading || formData.role === "curator"}
            />
          </>
        )}
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
