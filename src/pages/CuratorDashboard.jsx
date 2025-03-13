import { Outlet, useNavigate } from "react-router-dom";
import useUserChangePasswordAction from "../hooks/useUserChangePasswordAction";
import { Button } from "@mui/material";
import ChangePasswordForm from "../components/ChangePasswordForm";
import useAutoLogout from "../hooks/useAutoLogout";

const CuratorDashboard = () => {
  const navigate = useNavigate();
  const {
    handleChangePassword,
    openChangePasswordForm,
    setOpenChangePasswordForm,
  } = useUserChangePasswordAction();

  useAutoLogout();

  return (
    <>
      <h2>Куратор Панель</h2>
      <Button variant="contained" onClick={() => navigate("students-list")}>
        Учні
      </Button>
      <Button variant="contained" onClick={() => navigate("menu-list")}>
        Меню
      </Button>
      <Button variant="contained" disabled>
        Звіти
      </Button>

      <ChangePasswordForm
        open={openChangePasswordForm}
        onClose={() => setOpenChangePasswordForm(false)}
        onChangePassword={handleChangePassword}
      />
      <Outlet />
    </>
  );
};

export default CuratorDashboard;
