import { Outlet } from "react-router-dom";
import useAutoLogout from "../hooks/useAutoLogout";

const CuratorDashboard = () => {
  useAutoLogout();

  return (
    <>
      <Outlet />
    </>
  );
};

export default CuratorDashboard;
