import { useNavigate } from "react-router-dom";
import useUserChangePasswordAction from "../hooks/useUserChangePasswordAction";
import { logout } from "../utils";
import { Box, Button } from "@mui/material";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { layoutButtonStyles } from "../styles/button/button";

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
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: "12px", sm: "16px", md: "24px" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          sx={layoutButtonStyles.gradientPrimary}
          onClick={() => setOpenChangePasswordForm(true)}
        >
          Змінити пароль
        </Button>
        <Button
          variant="contained"
          sx={layoutButtonStyles.gradientLogout}
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
