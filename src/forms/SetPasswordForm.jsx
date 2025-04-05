import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const SetPasswordForm = ({ open, onClose, user, onSetPassword }) => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      // Очищення після закриття
      setNewPassword("");
      setError("");
    }
  }, [open]);

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

  const handleSubmitSetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await onSetPassword(user._id, newPassword);
      if (response.status !== 200) {
        setError(response.data.message);
        setIsLoading(false);
        return;
      }
      setError("");
      setShowNewPassword(false);
      onClose();
    } catch (error) {
      setError(error?.message || "Помилка встановлення пароля");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Встановити пароль</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
        <TextField
          autoComplete="off"
          fullWidth
          label="Новий пароль"
          margin="normal"
          onBlur={() => setNewPasswordFocused(false)} // Установлюємо фокус в false
          onChange={(e) => setNewPassword(e.target.value)}
          onFocus={() => setNewPasswordFocused(true)} // Установлюємо фокус в true
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showNewPassword ? "приховати пароль" : "показати пароль"
                    }
                    sx={{
                      color: newPasswordFocused // Змінюємо колір в залежності від фокусу
                        ? "textFieldOutline.primary"
                        : "extFieldOutline.secondary",
                    }}
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
          color="primary"
          loading={isLoading}
          loadingPosition="end"
          onClick={handleSubmitSetPassword}
          variant="contained"
        >
          Змінити пароль
        </Button>
      </DialogActions>
    </Dialog>
  );
};
