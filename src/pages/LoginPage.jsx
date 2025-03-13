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
import { useTheme } from "@mui/material/styles";
import { buttonStyles } from "../styles/button/button";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { loginUser, error, loading } = useAuth(); // Використовуємо хук для логіки авторизації

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleMouseUpPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const redirectPath = await loginUser(login, password); // Викликаємо хук для логіки авторизації
    navigate(redirectPath); // Перенаправляємо на відповідну сторінку
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
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          autoComplete="off"
          fullWidth
          margin="normal"
          label="Пароль"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "приховати пароль" : "показати пароль"
                    }
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
        />
        <Button
          variant="contained"
          fullWidth
          sx={buttonStyles.gradientPrimary}
          onClick={handleSubmit}
          disabled={loading} // Блокуємо кнопку під час завантаження
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{ color: theme.palette.spinner.main }}
            />
          ) : (
            "Увійти"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
