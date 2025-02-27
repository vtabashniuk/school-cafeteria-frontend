import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const BalanceForm = ({ open, onClose, student, onUpdateBalance }) => {
  const [balanceInput, setBalanceInput] = useState("");

useEffect(() => {
  if (!open) {
    setBalanceInput(""); // Очищення після закриття
  }
}, [open]);

  const handleChangeBalance = () => {
    const newBalance = parseFloat(balanceInput);
    if (isNaN(newBalance)) return;

    if (student.balance + newBalance < 0) {
      alert("Баланс не може бути менше 0.");
      return;
    }
    const updatedBalance = student.balance + newBalance;

    onUpdateBalance(student._id, updatedBalance);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Зміна балансу</DialogTitle>
      <DialogContent>
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
