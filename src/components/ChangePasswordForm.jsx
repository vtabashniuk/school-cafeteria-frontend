import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const ChangePasswordForm = ({ open, onClose, user, onChangePassword }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // Очищення після закриття
      setOldPassword("");
      setNewPassword("");
      setError("");
    }
  }, [open]);

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      const errorMessage = await onChangePassword(oldPassword, newPassword);

      if (errorMessage) {
        setError(errorMessage);
        setIsLoading(false);
        return;
      }
      setError("");
      onClose();
    } catch (error) {
      setError(error?.message || "Помилка зміни пароля");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Змінити пароль</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Cтарий пароль"
          type="password"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Новий пароль"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Закрити
        </Button>
        <Button
          onClick={handleChangePassword}
          color="primary"
          variant="contained"
        >
          {isLoading ? <CircularProgress size={24} /> : "Змінити пароль"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordForm;
