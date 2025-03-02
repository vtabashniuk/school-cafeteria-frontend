import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useUserChangePasswordAction from "../hooks/useUserChangePasswordAction";
import { Button } from "@mui/material";
import ChangePasswordForm from "../components/ChangePasswordForm";

const CuratorDashboard = () => {
  const navigate = useNavigate();
  const {
    handleChangePassword,
    openChangePasswordForm,
    setOpenChangePasswordForm,
  } = useUserChangePasswordAction();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <h2>Куратор Панель</h2>
      <p>Сьогодні: {new Date().toLocaleDateString()}</p>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Вийти
      </Button>
      <Button
        variant="contained"
        onClick={() => setOpenChangePasswordForm(true)}
      >
        Змінити пароль
      </Button>
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
