import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getMe } from "../redux/userSlice";
import { Box } from "@mui/material";
import {
  ButtonControlBar,
  DashboardHeader,
  DateComponent,
} from "../components/common";
// import DateComponent from "../components/common/DateComponent";
// import DashboardHeader from "../components/common/DashboardHeader";
import NavBar from "./NavBar";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser || null);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getMe());
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
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
    </UserContext.Provider>
  );
};

export default DashboardLayout;
