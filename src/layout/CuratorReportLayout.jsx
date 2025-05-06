import { useNavigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearReportData } from "../redux/reportSlice";
import { Box, Button, Typography } from "@mui/material";

const CuratorReportLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    dispatch(clearReportData()); // Очищаємо попередні дані
    navigate(page); // Переходимо на нову сторінку
  };

  return (
    <>
      <Typography>Звіти куратора</Typography>
      <Box>
        <Button onClick={() => handleNavigation("cafeteriaReport")}>
          Реєстр для їдальні
        </Button>
        <Button onClick={() => handleNavigation("todayOrders")}>
          Реєстр замовлень за поточну дату
        </Button>
        <Button>Реєстр замовлень за період</Button>
        <Button>Звіт по балансам</Button>
      </Box>
      <Outlet />
    </>
  );
};

export default CuratorReportLayout;
