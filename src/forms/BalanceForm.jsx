import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";

export const BalanceForm = ({ open, onClose, student, onUpdateBalance }) => {
  const [balanceInput, setBalanceInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setBalanceInput(""); // Очищення після закриття
      setError("");
    }
  }, [open]);

  const handleBalanceChange = (e) => {
    const inputValue = e.target.value;
    // Перевірка на ціле число, яке може бути від'ємним або додатним
    if (/^-?\d*$/.test(inputValue)) {
      setBalanceInput(inputValue); // Дозволяємо тільки ціле число, включаючи знак мінуса
      setError("");
    } else {
      setError("Введеть ціле значення балансу.");
      return;
    }
  };

  const handleBalanceSubmit = async () => {
    setIsLoading(true);
    const newBalance = parseInt(balanceInput, 10);
    if (isNaN(newBalance)) {
      setError("Введіть правильне число для зміни балансу.");
      setIsLoading(false);
      return;
    }

    if (student.balance + newBalance < 0) {
      setError("Баланс не може бути менше 0");
      setIsLoading(false);
      return;
    }
    const updatedBalance = student.balance + newBalance;
    const reason =
      newBalance < 0 ? "Видача коштів учню" : "Поповнення балансу учнем";

    try {
      const response = await onUpdateBalance(
        student._id,
        updatedBalance,
        reason
      );

      if (response.status !== 200) {
        setError(response);
        setIsLoading(false);
        return;
      }
      setError("");
    } catch (error) {
      setError(error?.message || "Помилка оновлення балансу");
    }
    onClose();
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Зміна балансу</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
        <Box pb={1}>
          <Typography>{student?.lastName}</Typography>
          <Typography>{student?.firstName}</Typography>
        </Box>
        <Box py={2}>
          <Alert
            icon={false}
            severity={
              student?.balance < 0
                ? "error"
                : student?.balance < 100
                ? "warning"
                : "success"
            }
          >
            Поточний баланс: {student?.balance} грн.
          </Alert>
        </Box>
        <TextField
          label="Зміна балансу"
          fullWidth
          onChange={handleBalanceChange}
          type="number"
          value={balanceInput}
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
          onClick={handleBalanceSubmit}
          variant="contained"
        >
          Оновити баланс
        </Button>
      </DialogActions>
    </Dialog>
  );
};
