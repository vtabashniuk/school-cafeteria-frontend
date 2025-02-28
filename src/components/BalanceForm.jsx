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

const BalanceForm = ({ open, onClose, student, onUpdateBalance }) => {
  const [balanceInput, setBalanceInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setBalanceInput(""); // Очищення після закриття
    }
  }, [open]);

  const handleChangeBalance = async () => {
    const newBalance = parseFloat(balanceInput);
    if (isNaN(newBalance)) return;

    if (student.balance + newBalance < 0) {
      setError("Баланс не може бути менше 0");
      return;
    }
    const updatedBalance = student.balance + newBalance;

    try {
      const errorMessage = await onUpdateBalance(student._id, updatedBalance);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }
      setError("");
    } catch (error) {
      setError(error?.message || "Помилка оновлення балансу");
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Зміна балансу</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <p>Прізвище: {student?.lastName}</p>
        <p>Ім'я: {student?.firstName}</p>
        <p>Поточний баланс: {student?.balance}</p>
        <TextField
          label="Зміна балансу"
          type="number"
          fullWidth
          margin="normal"
          value={balanceInput}
          onChange={(e) => setBalanceInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        <Button
          onClick={handleChangeBalance}
          color="primary"
          variant="contained"
        >
          Оновити баланс
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BalanceForm;
