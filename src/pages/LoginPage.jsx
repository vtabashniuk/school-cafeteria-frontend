import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import api from "../services/api";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { login, password });
      dispatch(setUser(response.data));

      switch (response.data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "curator":
          navigate("/curator");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Помилка авторизації");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5">Вхід</Typography>
        {error && <Typography color="error">{error}</Typography>}
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
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Увійти
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
