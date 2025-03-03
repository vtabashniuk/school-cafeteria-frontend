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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePasswordForm = ({ open, onClose, onChangePassword }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      // Очищення після закриття
      setOldPassword("");
      setNewPassword("");
      setError("");
    }
  }, [open]);

  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

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
      setShowOldPassword(false);
      setShowNewPassword(false);
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
          type={showOldPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          disabled={isLoading}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showOldPassword ? "приховати пароль" : "показати пароль"
                    }
                    onClick={handleClickShowOldPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Новий пароль"
          type={showNewPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showNewPassword ? "приховати пароль" : "показати пароль"
                    }
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
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
          {isLoading ? (
            <CircularProgress color="white" size={24} />
          ) : (
            "Змінити пароль"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordForm;
