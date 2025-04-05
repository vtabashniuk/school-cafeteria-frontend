import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { layoutButtonStyles } from "../styles/button/button";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, error, loading } = useAuth();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const redirectPath = await loginUser(login, password);
    navigate(redirectPath);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5">Вхід</Typography>
        {error && (
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        )}
        <TextField
          autoComplete="off"
          fullWidth
          label="Логін"
          margin="normal"
          onChange={(e) => setLogin(e.target.value)}
          value={login}
          variant="outlined"
          disabled={loading}
        />
        <TextField
          autoComplete="off"
          fullWidth
          label="Пароль"
          margin="normal"
          onBlur={() => setPasswordFocused(false)} // Установлюємо фокус в false
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)} // Установлюємо фокус в true
          type={showPassword ? "text" : "password"}
          value={password}
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "приховати пароль" : "показати пароль"
                    }
                    sx={{
                      color: passwordFocused // Змінюємо колір в залежності від фокусу
                        ? "textFieldOutline.primary"
                        : "extFieldOutline.secondary",
                    }}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          disabled={loading}
        />
        <Button
          variant="contained"
          sx={{
            ...layoutButtonStyles.gradientPrimary,
            "& .MuiCircularProgress-circle": {
              stroke: (theme) => theme.palette.spinner.white, // Задає колір для спінера
            },
          }}
          onClick={handleSubmit}
          loading={loading}
          loadingPosition="end"
        >
          Увійти
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
