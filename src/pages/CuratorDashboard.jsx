import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const CuratorDashboard = () => {
  const navigate = useNavigate();

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
      <Button variant="contained" onClick={() => navigate("students-list")}>
        Учні
      </Button>
      <Button variant="contained" onClick={() => navigate("menu-list")}>
        Меню
      </Button>
      <Button variant="contained" disabled>
        Звіти
      </Button>
      <Outlet />
    </>
  );
};

export default CuratorDashboard;
