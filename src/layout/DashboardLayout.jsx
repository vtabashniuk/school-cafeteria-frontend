import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import DateComponent from "../components/common/DateComponent";
import NavBar from "./NavBar";

const DashboardLayout = () => {
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
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
