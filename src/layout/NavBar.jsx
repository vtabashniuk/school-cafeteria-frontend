import { useNavigate } from "react-router-dom";
import useUserChangePasswordAction from "../hooks/useUserChangePasswordAction";
import { logout } from "../utils";
import { Box, Button } from "@mui/material";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { buttonStyles } from "../styles/button/button";

const NavBar = () => {
  const navigate = useNavigate();
  const {
    handleChangePassword,
    openChangePasswordForm,
    setOpenChangePasswordForm,
  } = useUserChangePasswordAction();

  return (
    <>
      <Box
        sx={{
          display: "flex", // Використовуємо flexbox для розташування кнопок в ряд
          flexDirection: { xs: "column", sm: "row" }, // Для мобільних (xs) кнопки вертикально, для планшетів і десктопів (sm і вище) — в ряд
          gap: { xs: "12px", sm: "16px", md: "24px" }, // Встановлюємо gap в залежності від розміру екрану
          justifyContent: "center", // Центруємо кнопки по горизонталі
          alignItems: "center", // Центруємо кнопки по вертикалі
        }}
      >
        <Button
          variant="contained"
          sx={buttonStyles.gradientPrimary}
          onClick={() => setOpenChangePasswordForm(true)}
        >
          Змінити пароль
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles.gradientLogout}
          onClick={() => logout(navigate)}
        >
          Вийти
        </Button>
      </Box>
      <ChangePasswordForm
        open={openChangePasswordForm}
        onClose={() => setOpenChangePasswordForm(false)}
        onChangePassword={handleChangePassword}
      />
    </>
  );
};

export default NavBar;
