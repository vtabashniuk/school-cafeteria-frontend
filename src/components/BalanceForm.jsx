import React, { useState } from "react";
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

  const handleChangeBalance = () => {
    const newBalance = parseFloat(balanceInput);
    if (isNaN(newBalance)) return;

    const updatedBalance = student.balance + newBalance;
    if (updatedBalance < -200) {
      alert("Баланс не може бути менше -200.");
      return;
    }

    onUpdateBalance(student.id, updatedBalance);
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
