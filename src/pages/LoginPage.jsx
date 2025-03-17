import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  const [loginFocused, setLoginFocused] = useState(false);
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
          margin="normal"
          label="Логін"
          variant="outlined"
          value={login}
          onBlur={() => setLoginFocused(false)} // Установлюємо фокус в false
          onChange={(e) => setLogin(e.target.value)}
          onFocus={() => setLoginFocused(true)} // Установлюємо фокус в true
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: loginFocused
                  ? "textFieldOutline.primary"
                  : "textFieldOutline.secondary", // Зміна кольору outline
              },
              "&:hover fieldset": {
                borderColor: loginFocused
                  ? "textFieldOutline.primary"
                  : "textFieldOutline.primary", // Колір при ховері
              },
              "&.Mui-focused fieldset": {
                borderColor: "textFieldOutline.primary", // Колір при фокусі
              },
            },
          }}
        />
        <TextField
          autoComplete="off"
          fullWidth
          margin="normal"
          label="Пароль"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onBlur={() => setPasswordFocused(false)} // Установлюємо фокус в false
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)} // Установлюємо фокус в true
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "приховати пароль" : "показати пароль"
                    }
                    sx={{
                      color: passwordFocused
                        ? "textFieldOutline.primary"
                        : "extFieldOutline.secondary", // Змінюємо колір в залежності від фокусу
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
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: passwordFocused
                  ? "textFieldOutline.primary"
                  : "textFieldOutline.secondary", // Зміна кольору обводки
              },
              "&:hover fieldset": {
                borderColor: passwordFocused
                  ? "textFieldOutline.primary"
                  : "textFieldOutline.primary", // Колір при ховері
              },
              "&.Mui-focused fieldset": {
                borderColor: "textFieldOutline.primary", // Колір при фокусі
              },
            },
          }}
        />
        <Button
          variant="contained"
          sx={layoutButtonStyles.gradientPrimary}
          onClick={handleSubmit}
          disabled={loading} // Блокуємо кнопку під час завантаження
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "spinner.secondary" }} />
          ) : (
            "Увійти"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
