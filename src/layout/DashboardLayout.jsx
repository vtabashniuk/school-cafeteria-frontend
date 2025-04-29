import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  ButtonControlBar,
  DashboardHeader,
  DateComponent,
} from "../components/common";
import NavBar from "./NavBar";
import { Box } from "@mui/material";

const DashboardLayout = () => {
  const loading = useSelector((state) => state.user.loading);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <DateComponent />
        <NavBar />
      </Box>
      <DashboardHeader loading={loading} />
      <ButtonControlBar />
      <Outlet />
    </>
  );
};

export default DashboardLayout;
